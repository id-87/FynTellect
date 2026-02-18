from fastapi import FastAPI
import joblib
app=FastAPI()
model=joblib.load('fraudModel.pkl')
@app.get("/")
def health():
    return "Running fastapi"

@app.post('/fraudPred')
def fraudDet(dict):
    # here we need to perform data preprocessing and hten run the model predicitn script and then return the result
    target=model.predict(dict)
    acc=model.accuracy_score

