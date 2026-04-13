from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
db = client['Fin']
trans_col = db["transactions"]

def get_transaction(user_id: str) -> list:
    try:
        uid = ObjectId(user_id)
        transactions = list(trans_col.find(
            {"user": uid, "status": "successful"},
            {"_id": 0, "user": 0, "__v": 0}  # exclude ObjectId fields
        ))
        return transactions
    except Exception as e:
        print(f"get_transaction error: {e}")
        return []

def get_transaction_by_category(user_id: str, category: str) -> list:
    try:
        uid = ObjectId(user_id)
        return list(trans_col.find(
            {"user": uid, "status": "successful", "category": category},
            {"_id": 0, "user": 0, "__v": 0}
        ))
    except Exception as e:
        print(f"get_transaction_by_category error: {e}")
        return []

def get_monthly_transaction(user_id: str, month: int, year: int) -> list:
    try:
        uid = ObjectId(user_id)
        start = datetime(year, month, 1)
        if month == 12:
            end = datetime(year + 1, 1, 1)
        else:
            end = datetime(year, month + 1, 1)
        return list(trans_col.find(
            {
                "user": uid,
                "createdAt": {"$gte": start, "$lt": end}
            },
            {"_id": 0, "user": 0, "__v": 0}
        ))
    except Exception as e:
        print(f"get_monthly_transaction error: {e}")
        return []