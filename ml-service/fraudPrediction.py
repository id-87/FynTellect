from fastapi import FastAPI
import joblib
import pandas as pd
app=FastAPI()
model=joblib.load('fraudModel.pkl')
@app.get("/")
def health():
    return "Running fastapi"

trained_columns=joblib.load('fraud_columns.pkl')


THRESHOLD=0.3
@app.post('/fraudPred')
def predict_fraud(dict):
    df=pd.DataFrame([dict])
    df=pd.get_dummies(df,drop_first=True)
    
    df = df.reindex(columns=trained_columns, fill_value=0)


    fraud_probability = model.predict_proba(df)[0][1]
    is_fraud = fraud_probability > THRESHOLD

    return {
        "isFraud": bool(is_fraud),
        "fraudScore": round(float(fraud_probability), 4),
        "thresholdUsed": THRESHOLD
    }

    
if __name__ == "__main__":

    sample_input = {
        "Transaction Amount": 1500,
        "Quantity": 1,
        "Customer Age": 45,
        "Account Age Days": 300,
        "Transaction Hour": 2,
        "Payment Method": "credit card",
        "Product Category": "electronics",
        "Device Used": "mobile"
    }

    result = predict_fraud(sample_input)
    print(result)