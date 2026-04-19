from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()

embedder = SentenceTransformer("all-MiniLM-L6-v2")
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

budget_index = pc.Index("fyn-budgets")
memory_index = pc.Index("fyn-memory")



def set_budget(user_id: str, category: str, amount: float) -> dict:
    text = f"{category} budget for user {user_id}"
    vector = embedder.encode(text).tolist()
    budget_index.upsert(vectors=[{
        "id": f"{user_id}_{category}",
        "values": vector,
        "metadata": {
            "user_id": user_id,
            "category": category,
            "amount": float(amount)
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
    return [get_budget(user_id, c) for c in categories if "amount" in get_budget(user_id, c)]

def delete_budget(user_id: str, category: str) -> dict:
    budget_index.delete(ids=[f"{user_id}_{category}"])
    return {"message": f"Budget deleted for {category}"}



def sync_transactions(user_id: str, transactions: list):
    """Sync all MongoDB transactions to fyn-memory index"""
    if not transactions:
        print(f"No transactions to sync for user {user_id}")
        return

    vectors = []
    for t in transactions:
        
        text = (
            f"{t.get('type', 'unknown')} of ₹{t.get('amount', 0)} "
            f"for {t.get('category', 'unknown')} "
            f"status {t.get('status', 'unknown')} "
            f"date {str(t.get('createdAt', ''))[:10]}"
        )
        vector = embedder.encode(text).tolist()


        unique_key = (
            f"{user_id}_"
            f"{t.get('category','')}_{t.get('amount',0)}_"
            f"{str(t.get('createdAt',''))[:10]}"
        )

        vectors.append({
            "id": unique_key,
            "values": vector,
            "metadata": {
                "user_id": user_id,
                "type": t.get("type", ""),
                "amount": float(t.get("amount", 0)),
                "category": t.get("category", ""),
                "status": t.get("status", ""),
                "text": text,
                "date": str(t.get("createdAt", ""))[:10]
            }
        })

   
    for i in range(0, len(vectors), 100):
        memory_index.upsert(vectors=vectors[i:i + 100])

    print(f"Synced {len(vectors)} transactions to Pinecone for user {user_id}")

def search_transactions(user_id: str, query: str, top_k: int = 10) -> list:
    """Search relevant transactions by semantic similarity"""
    vector = embedder.encode(query).tolist()
    results = memory_index.query(
        vector=vector,
        top_k=top_k,
        filter={"user_id": {"$eq": user_id}},
        include_metadata=True
    )
    return [m.metadata for m in results.matches]