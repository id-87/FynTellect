from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))

db=client['Fin']

trans_col=db["transactions"]

def get_transaction(user_id:str):
    user_id=ObjectId(user_id)
    transactions=list(trans_col.find({"user":user_id}))
    return transactions

def get_transaction_by_category(user_id:str,category:str):
    user_id=ObjectId(user_id)
    transaction=list(trans_col.find({"user":user_id,"category":category}))
    return transaction
