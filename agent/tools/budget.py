from endee import Endee, Precision

from sentence_transformers import SentenceTransformer
embedder=SentenceTransformer("all-MiniLM-L6-v2")

client=Endee()
client.set_base_url("http://localhost:8080/api/v1")
try:
    index=client.get_index("budgets")
except:
    client.create_index(
        name="budgets",
        dimension=384,
        space_type="cosine",
        precision=Precision.INT8
    )
    index=client.get_index("budgets")



def set_budget(user_id,category,amount):
    text=f"{category} for user {user_id}"
    vector=embedder.encode(text).tolist()
    index.upsert([{
        "id":f"{user_id}_{category}",
        'vector':vector,
        "meta":{
            "user_id":user_id,
            "category":category,
            "amount":amount
        }
    }])

def get_budget(user_id,category):
    query_text=f"{category} budget for user {user_id}"
    query_vector=embedder.encode(query_text).tolist()
    result=index.query(query_vector,top_k=1)
    if result:
        return result[0]['meta']
    else:
        return {"message":"No budget set for this category"}
