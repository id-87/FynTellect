from langchain.tools import tool

@tool
def analyse_spending(user_id):
    """
    Analyse spending breakdown by category for a user.
    Use this when user asks
    what are my expenses, show my spending breakdown."""

    from tools.spending import analyse_spending
    result=analyse_spending(user_id)
    return str(result)


@tool
def forecast_cashflow(user_id):
    """
    Predict next month cashflow based on past three months transactions.
    Use this when user asked for predicting next month budget"""

    from tools.cashflow import forecast_cashflow
    result=forecast_cashflow(user_id)
    return str(result)

@tool
def set_budget(user_id,category,amount):
    """You have to set budget of the user for a specified category"""
    from tools.budget import set_budget
    result=set_budget(user_id,category,amount)
    return str(result)

@tool
def search_stock_news(stock_name,market):
    """Search and return stock news for the given stock in the given market"""
    from tools.stocks import search_stock_news
    result=search_stock_news(stock_name,market)