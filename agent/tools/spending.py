from db import get_transaction
def analyse_spending(user_id):
    trans=get_transaction(user_id)
    if not trans:
        return "No user found"
    result={}
    for tran in trans:
        cat=tran["category"]
        amt=tran["amount"]
        if cat not in result:
            result[cat]=0
        result[cat]+=amt
    result=dict(sorted(result.items(),key=lambda x:x[1],reverse=True))

    return {
        "total_spent":sum(tran["amount"] for tran in trans),
        "transaction_count":len(trans),
        "biggest_category":list(result.keys())[0],
        "breakdown":result
    }




