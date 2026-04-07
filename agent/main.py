import jwt
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import os
from agent import create_agent
from dotenv import load_dotenv

load_dotenv()


# from agent import create_tool
JWT_SECRET=os.getenv("JWT_SECRET")
print("JWT SECRET LOADED:", JWT_SECRET) 

def verify_token(token):
    decoded=jwt.decode(token,JWT_SECRET,algorithms=["HS256"])
    return decoded

app=FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.get("/health")
def health():
    return "Fast api running"
from agent import run_agent

@app.post('/chat')
def chat(request: ChatRequest, authorization: str = Header(None)):
    if not authorization:
        return {"message": "Forbidden"}
    try:
        token = authorization.split(" ")[1]
        decoded = verify_token(token)
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = decoded["_id"]
    response = run_agent(user_id, request.message)
    return {"response": response}




