import jwt
from fastapi import FastAPI, Header, HTTPException
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


from pydantic import BaseModel
import os
from agent import create_agent
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
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




# @app.post('/chat')
# def chat(request: ChatRequest, authorization: str = Header(None)):
#     if not authorization:
#         return {"message": "Forbidden"}
#     try:
#         print("token start")
#         token = authorization.split(" ")[1]
#         decoded = verify_token(token)
#         user_id = decoded["_id"]
#         # return user_id
#         response = run_agent(user_id, request.message)
#     except:
#         print(Exception)
#         raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    
    
#     return {"response": response}




@app.post('/chat')
def chat(request: ChatRequest, creds: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = creds.credentials
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        response = run_agent(decoded["_id"], request.message)
        return {"response": response}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")