from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import os
import json
import time
from dotenv import load_dotenv

load_dotenv()

embedder = SentenceTransformer("all-MiniLM-L6-v2")
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Two separate indexes
budget_index = pc.Index("fyn-budgets")
memory_index = pc.Index("fyn-memory")  # for transactions + chat history

# ─── BUDGET FUNCTIONS ───

def set_budget(user_id: str, category: str, amount: float) -> dict:
    text = f"{category} budget for user {user_id}"
    vector = embedder.encode(text).tolist()
    budget_index.upsert(vectors=[{
        "id": f"{user_id}_{category}",
        "values": vector,
        "metadata": {
            "user_id": user_id,
            "category": category,
            "amount": float(amount),
            "type": "budget"
        }
    }])
    return {"message": f"Budget set: ₹{amount} for {category}"}

def get_budget(user_id: str, category: str) -> dict:
    text = f"{category} budget for user {user_id}"
    vector = embedder.encode(text).tolist()
    results = budget_index.query(
        vector=vector,
        top_k=1,
        filter={"user_id": {"$eq": user_id}},
        include_metadata=True
    )
    if results.matches:
        meta = results.matches[0].metadata
        return {"category": meta["category"], "amount": meta["amount"]}
    return {"message": f"No budget set for {category}"}

def get_all_budgets(user_id: str) -> list:
    categories = ["marketing", "development", "testing", "legal"]
    budgets = []
    for cat in categories:
        result = get_budget(user_id, cat)
        if "amount" in result:
            budgets.append(result)
    return budgets

def delete_budget(user_id: str, category: str) -> dict:
    budget_index.delete(ids=[f"{user_id}_{category}"])
    return {"message": f"Budget deleted for {category}"}

# ─── TRANSACTION MEMORY FUNCTIONS ───

def store_transaction(user_id: str, transaction: dict):
    """Store a transaction as a vector in Pinecone"""
    text = (
        f"{transaction.get('type', '')} transaction of ₹{transaction.get('amount', 0)} "
        f"in {transaction.get('category', '')} category "
        f"with status {transaction.get('status', '')} "
        f"on {transaction.get('createdAt', '')}"
    )
    vector = embedder.encode(text).tolist()
    txn_id = str(transaction.get("_id", f"{user_id}_{time.time()}"))
    memory_index.upsert(vectors=[{
        "id": f"txn_{txn_id}",
        "values": vector,
        "metadata": {
            "user_id": user_id,
            "type": "transaction",
            "amount": float(transaction.get("amount", 0)),
            "category": transaction.get("category", ""),
            "status": transaction.get("status", ""),
            "txn_type": transaction.get("type", ""),
            "text": text,
            "created_at": str(transaction.get("createdAt", ""))
        }
    }])

def sync_transactions_to_pinecone(user_id: str, transactions: list):
    """Bulk sync all MongoDB transactions to Pinecone"""
    if not transactions:
        return
    vectors = []
    for t in transactions:
        text = (
            f"{t.get('type', '')} transaction of ₹{t.get('amount', 0)} "
            f"in {t.get('category', '')} category "
            f"with status {t.get('status', '')} "
            f"on {str(t.get('createdAt', ''))}"
        )
        vector = embedder.encode(text).tolist()
        txn_id = str(t.get("_id", f"{user_id}_{time.time()}"))
        vectors.append({
            "id": f"txn_{txn_id}",
            "values": vector,
            "metadata": {
                "user_id": user_id,
                "type": "transaction",
                "amount": float(t.get("amount", 0)),
                "category": t.get("category", ""),
                "status": t.get("status", ""),
                "txn_type": t.get("type", ""),
                "text": text,
                "created_at": str(t.get("createdAt", ""))
            }
        })
    # Upsert in batches of 100
    for i in range(0, len(vectors), 100):
        memory_index.upsert(vectors=vectors[i:i+100])

def search_transactions(user_id: str, query: str, top_k: int = 10) -> list:
    """Search relevant transactions using semantic search"""
    vector = embedder.encode(query).tolist()
    results = memory_index.query(
        vector=vector,
        top_k=top_k,
        filter={
            "user_id": {"$eq": user_id},
            "type": {"$eq": "transaction"}
        },
        include_metadata=True
    )
    return [m.metadata for m in results.matches]

# ─── CHAT HISTORY FUNCTIONS ───

def store_chat_message(user_id: str, role: str, content: str):
    """Store a chat message as a vector"""
    vector = embedder.encode(content).tolist()
    msg_id = f"chat_{user_id}_{int(time.time() * 1000)}"
    memory_index.upsert(vectors=[{
        "id": msg_id,
        "values": vector,
        "metadata": {
            "user_id": user_id,
            "type": "chat",
            "role": role,
            "content": content,
            "timestamp": int(time.time())
        }
    }])

def get_relevant_history(user_id: str, current_message: str, top_k: int = 6) -> list:
    """Get most relevant past messages for current question"""
    vector = embedder.encode(current_message).tolist()
    results = memory_index.query(
        vector=vector,
        top_k=top_k,
        filter={
            "user_id": {"$eq": user_id},
            "type": {"$eq": "chat"}
        },
        include_metadata=True
    )
    # Sort by timestamp to maintain order
    messages = sorted(
        [m.metadata for m in results.matches],
        key=lambda x: x.get("timestamp", 0)
    )
    return [{"role": m["role"], "content": m["content"]} for m in messages]

def clear_chat_history(user_id: str):
    """Clear all chat history for a user"""
    # Pinecone doesn't support filter-based delete in all tiers
    # So we fetch IDs first then delete
    dummy_vector = [0.0] * 384
    results = memory_index.query(
        vector=dummy_vector,
        top_k=100,
        filter={
            "user_id": {"$eq": user_id},
            "type": {"$eq": "chat"}
        },
        include_metadata=False
    )
    ids = [m.id for m in results.matches]
    if ids:
        memory_index.delete(ids=ids)
    return {"message": "History cleared"}