from fastapi import FastAPI
import joblib
app=FastAPI()
model=joblib.load('fraudModel.pkl')
@app.get("/")
def health():
    return "Running fastapi"

@app.post('/fraudPred')
def fraudDet(dict):
    return model.predict(dict)

