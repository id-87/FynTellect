import os
import jwt
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from agent import run_agent
from tools.budget import set_budget, get_all_budgets, delete_budget
from collections import defaultdict

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
app = FastAPI(title="Fyntellect Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory conversation history per user
# Format: {user_id: [{"role": "user/assistant", "content": "..."}]}
conversation_history = defaultdict(list)
MAX_HISTORY = 10  # keep last 10 messages

class ChatRequest(BaseModel):
    message: str

class BudgetRequest(BaseModel):
    category: str
    amount: float

def verify_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

def get_user_id(authorization: str) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")
    try:
        token = authorization.split(" ")[1]
        decoded = verify_token(token)
        return decoded["_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@app.get('/')
def root():
    return "Fynagent running"


@app.get("/health")
def health():
    return {"status": "Fyntellect agent running"}

@app.post("/chat")
def chat(request: ChatRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    # Get existing history for this user
    history = conversation_history[user_id]

    try:
        response = run_agent(user_id, request.message, history)

        # Update history
        history.append({"role": "user", "content": request.message})
        history.append({"role": "assistant", "content": response})

        # Keep only last MAX_HISTORY messages
        if len(history) > MAX_HISTORY * 2:
            conversation_history[user_id] = history[-(MAX_HISTORY * 2):]

        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/chat/history")
def clear_history(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    conversation_history[user_id] = []
    return {"message": "Conversation history cleared"}

@app.post("/budget")
def create_budget(request: BudgetRequest, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    result = set_budget(user_id, request.category, request.amount)
    return result

@app.get("/budget")
def list_budgets(authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    budgets = get_all_budgets(user_id)
    return {"budgets": budgets}

@app.delete("/budget/{category}")
def remove_budget(category: str, authorization: str = Header(None)):
    user_id = get_user_id(authorization)
    result = delete_budget(user_id, category)
    return result