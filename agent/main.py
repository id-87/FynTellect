import os
import jwt
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from collections import defaultdict
from agent import run_agent
from tools.memory import set_budget, get_all_budgets, delete_budget

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
app = FastAPI(title="Fyntellect Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


conversation_history = defaultdict(list)
MAX_HISTORY = 20  

class ChatRequest(BaseModel):
    message: str

class BudgetRequest(BaseModel):
    category: str
    amount: float

def verify_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

def get_user_id(authorization: str) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="No token")
    try:
        token = authorization.split(" ")[1]
        return verify_token(token)["_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/health")
def health():
    return {"status": "Fyntellect running"}

@app.post("/chat")
def chat(request: ChatRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    history = conversation_history[user_id]

    response = run_agent(user_id, request.message, history)

    
    history.append({"role": "user", "content": request.message})
    history.append({"role": "assistant", "content": response})

   
    if len(history) > MAX_HISTORY:
        conversation_history[user_id] = history[-MAX_HISTORY:]

    return {"response": response}

@app.delete("/chat/history")
def clear_history(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conversation_history[user_id] = []
    return {"message": "History cleared"}

@app.post("/budget")
def create_budget(request: BudgetRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    return set_budget(user_id, request.category, request.amount)

@app.get("/budget")
def list_budgets(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    return {"budgets": get_all_budgets(user_id)}

@app.delete("/budget/{category}")
def remove_budget(category: str, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    return delete_budget(user_id, category)