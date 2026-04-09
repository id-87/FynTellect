import os
import jwt
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from agent import run_agent

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
app = FastAPI(title="FinOS Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

def verify_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

@app.get("/health")
def health():
    return {"status": "FinOS agent running"}

@app.post("/chat")
def chat(request: ChatRequest, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")
    try:
        token = authorization.split(" ")[1]
        decoded = verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_id = decoded["_id"]
    try:
        response = run_agent(user_id, request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))