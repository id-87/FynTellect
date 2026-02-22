from fastapi import FastAPI
import joblib
import pandas as pd
app=FastAPI()
model=joblib.load('fraudModel.pkl')
@app.get("/")
def health():
    return "Running fastapi"

trained_columns=joblib.load('fraud_columns.pkl')

@app.post('/fraudPred')
def predict_fraud(dict):
    df=pd.DataFrame([dict])
    df=pd.get_dummies(df,drop_first=True)
    for col in trained_columns:
        if col not in df.columns:
            df[col]=0
    df=df[trained_columns]
    pred=model.predict(df)[0]

    # here we need to perform data preprocessing and hten run the model predicitn script and then return the result
    return pred

if __name__ == "__main__":
    sample_input = {
        "Amount": 2500,
        "Payment Method": "Credit Card",
        "Product Category": "Electronics",
        "Customer Location": "New York",
        "Device Used": "Mobile",
        "Shipping Address": "New York",
        "Billing Address": "New York"
    }

    result = predict_fraud(sample_input)
    print(result)

