from datetime import datetime
from db import get_monthly_transaction

def forecast_cashflow(user_id):
    
    mon=datetime.now().month
    yr=datetime.now().year
    if mon==2:
        m1=12
        y1=yr-1
        m2=mon-1
        y2=yr
        m3=mon
        y3=yr
    elif mon==1:
        m1=11
        y1=yr-1
        m2=12
        y2=yr-1
        m3=mon
        y3=yr
    else:
        m1=mon-2
        m2=mon-1
        m3=mon
        y1=y2=y3=yr
    
    s1=sum(t["amount"] for t in get_monthly_transaction(user_id,m1,y1))
    s2=sum(t["amount"] for t in get_monthly_transaction(user_id,m2,y2))
    s3=sum(t["amount"] for t in get_monthly_transaction(user_id,m3,y3))
    s=s1+s2+s3
    return {
    "predicted_spend": s/3,
    "based_on_months": 3,
    "monthly_totals": [s1, s2, s3]  
}
   





        
        
        
   


