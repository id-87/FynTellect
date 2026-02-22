import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib

df=pd.read_csv('fraudModelTrain.csv')
# encoders={}
# categorial_collumns=['Payment Method', 'Product Category', 'Customer Location', 'Device Used', 'Shipping Address', 'Billing Address']
# for col in categorial_collumns:
#     encoder=LabelEncoder()
#     df[col]=encoder.fit(df[col])
#     encoders[col]=encoder

# X=df.drop(['Is Fraudulent','Transaction ID','Customer ID','Transaction Date'],axis=1)
X=df.drop(['Is Fraudulent','Transaction ID','Customer ID','Transaction Date'],axis=1)
X=pd.get_dummies(X,drop_first=True)
y=df['Is Fraudulent']
X_train,X_test,y_train,y_test=train_test_split(X,y,random_state=42,test_size=0.2)

model=RandomForestClassifier()
model.fit(X_train,y_train)
accuracy_score=model.score(X_test,y_test)
print(accuracy_score)
joblib.dump(model,'fraudModel.pkl')
joblib.dump(X.columns.tolist(), "fraud_columns.pkl")
