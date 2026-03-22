import jwt
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import os
from agent import create_agent
# from agent import create_tool
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
def chat(request:ChatRequest,authorisation:str=Header(None)):
    if not authorisation:
        return {"message":"Forbidden"}
    token=authorisation.split(" ")[1]
    decoded=verify_token(token)
    user_id=decoded["_id"]
    executor=create_agent(user_id)
    result=executor.invoke({"input":request.message})
    return {"response": result["output"]}
    




