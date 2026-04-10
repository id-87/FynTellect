from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()

embedder = SentenceTransformer("all-MiniLM-L6-v2")

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("fyn-budgets")

def set_budget(user_id: str, category: str, amount: float) -> dict:
    text = f"{category} budget for user {user_id}"
    vector = embedder.encode(text).tolist()
    index.upsert(vectors=[{
        "id": f"{user_id}_{category}",
        "values": vector,
        "metadata": {
            "user_id": user_id,
            "category": category,
            "amount": amount
        }
    }])
    return {"message": f"Budget set: ₹{amount} for {category}"}

def get_budget(user_id: str, category: str) -> dict:
    text = f"{category} budget for user {user_id}"
    vector = embedder.encode(text).tolist()
    results = index.query(
        vector=vector,
        top_k=1,
        filter={"user_id": {"$eq": user_id}},
        include_metadata=True
    )
    if results.matches:
        meta = results.matches[0].metadata
        return {"category": meta["category"], "amount": meta["amount"]}
    return {"message": f"No budget set for {category}"}