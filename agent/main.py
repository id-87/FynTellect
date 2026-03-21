import jwt
from fastapi import FastAPI
from pydantic import BaseModel
import os
JWT_SECRET=os.getenv("JWT_SECRET")
def verify_token(token):
    decoded=jwt.decode(token,JWT_SECRET,algorithms=["HS256"])
    return decoded

app=FastAPI()

class ChatRequest(BaseModel):
    message: str


@app.get("/health")
def health():
    return "Fast api running"
@app.post('/chat')
def chat(request,authorisation):
    if not authorisation:
        return {"message":"Forbidden"}
    




