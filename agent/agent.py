from langchain.tools import tool
from langchain_groq  import ChatGroq
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
import os


def create_tool(user_id):
        
    @tool
    def analyse_spending_tool():
        """
        Analyse spending breakdown by category for a user.
        Use this when user asks
        what are my expenses, show my spending breakdown."""

        from tools.spending import analyse_spending
        result=analyse_spending(user_id)
        return str(result)
    


    @tool
    def forecast_cashflow_tool():
        """
        Predict next month cashflow based on past three months transactions.
        Use this when user asked for predicting next month budget"""

        from tools.cashflow import forecast_cashflow
        result=forecast_cashflow(user_id)
        return str(result)
    

    @tool
    def set_budget_tool(category,amount):
        """You have to set budget of the user for a specified category"""
        from tools.budget import set_budget
        result=set_budget(user_id,category,amount)
        return str(result)

    @tool
    def search_stock_news_tool(stock_name,market):
        """Search and return stock news for the given stock in the given market"""
        from tools.stocks import search_stock_news
        result=search_stock_news(stock_name,market)
        return str(result)
    return [analyse_spending_tool, forecast_cashflow_tool, set_budget_tool, search_stock_news_tool]


def create_agent(user_id):
    llm=ChatGroq(
        model='llama-3.3-70b-versatile',
        api_key=os.getenv("GROQ_API_KEY"),
    )

    tools=creat_tool(user_id)

    prompt=ChatPromptTemplate.from_messages([
        ("system","You are FinOS, and AI financial assistant. Help users understand their spending, forecast cashflow, manage budgets and research stocks. Be concise and use Indian Rupees for amounts."),
        ("human","{input}"),
        ("placeholder","{agent_scratchpad}")
    ])
    

    agent=create_tool_calling_agent(llm,tools,prompt)
    return AgentExecutor(agent=agent,tools=tools)