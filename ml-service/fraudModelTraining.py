import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

df=pd.read_csv('fraudModelTrain.csv')
# encoders={}
# categorial_collumns=['Payment Method', 'Product Category', 'Customer Location', 'Device Used', 'Shipping Address', 'Billing Address']
# for col in categorial_collumns:
#     encoder=LabelEncoder()
#     df[col]=encoder.fit(df[col])
#     encoders[col]=encoder

# X=df.drop(['Is Fraudulent','Transaction ID','Customer ID','Transaction Date'],axis=1)
X = df.drop([
    'Is Fraudulent',
    'Transaction ID',
    'Customer ID',
    'Transaction Date',
    'Shipping Address',
    'Billing Address'
], axis=1)
X=pd.get_dummies(X,drop_first=True)
y=df['Is Fraudulent']
X_train,X_test,y_train,y_test=train_test_split(X,y,random_state=42,test_size=0.2)

model=RandomForestClassifier(class_weight='balanced',random_state=42)
model.fit(X_train,y_train)





y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nROC-AUC Score:", roc_auc_score(y_test, y_prob))



joblib.dump(model,'fraudModel.pkl')
joblib.dump(X.columns.tolist(), "fraud_columns.pkl")
