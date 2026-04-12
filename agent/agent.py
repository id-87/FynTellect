import os
import json
import requests
from dotenv import load_dotenv
from tools.spending import analyse_spending
from tools.cashflow import forecast_cashflow
from tools.budget import set_budget, get_budget, get_all_budgets
from tools.stocks import search_stock_news
from db import get_transaction

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "analyse_spending",
            "description": "Analyse spending breakdown by category. Use when user asks about expenses, spending, how much they spent.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "forecast_cashflow",
            "description": "Predict next month spending. Use when user asks about predictions, forecasts, next month budget.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_budget",
            "description": "Set a monthly budget limit for a category.",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {"type": "string", "enum": ["marketing", "development", "testing", "legal"]},
                    "amount": {"type": "number"}
                },
                "required": ["category", "amount"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_budget",
            "description": "Get budget limit for a specific category.",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {"type": "string"}
                },
                "required": ["category"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_all_budgets",
            "description": "Get all budget limits set by the user across all categories.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_stock_news",
            "description": "Search latest stock news. Use when user asks about stocks, investments, market.",
            "parameters": {
                "type": "object",
                "properties": {
                    "stock_name": {"type": "string"},
                    "market": {"type": "string", "default": "global"}
                },
                "required": ["stock_name"]
            }
        }
    }
]

def call_tool(name: str, args: dict, user_id: str):
    if name == "analyse_spending":
        return analyse_spending(user_id)
    elif name == "forecast_cashflow":
        return forecast_cashflow(user_id)
    elif name == "set_budget":
        return set_budget(user_id, args["category"], args["amount"])
    elif name == "get_budget":
        return get_budget(user_id, args["category"])
    elif name == "get_all_budgets":
        return get_all_budgets(user_id)
    elif name == "search_stock_news":
        return search_stock_news(args["stock_name"], args.get("market", "global"))
    return "Tool not found"

def build_context(user_id: str) -> str:
    """Build rich context about the user for the system prompt"""
    try:
        transactions = get_transaction(user_id)
        total = sum(t["amount"] for t in transactions)
        cats = {}
        for t in transactions:
            cats[t["category"]] = cats.get(t["category"], 0) + t["amount"]
        
        budgets = get_all_budgets(user_id)
        budget_str = ", ".join([f"{b['category']}: ₹{b['amount']}" for b in budgets]) if budgets else "No budgets set"
        cat_str = ", ".join([f"{k}: ₹{v}" for k, v in cats.items()]) if cats else "No transactions"

        return f"""
User Financial Context:
- Total transactions: {len(transactions)}
- Total spent: ₹{total:,.0f}
- Spending by category: {cat_str}
- Configured budgets: {budget_str}
"""
    except Exception as e:
        return "Context unavailable"

def run_agent(user_id: str, message: str) -> str:
    context = build_context(user_id)

    messages = [
        {
            "role": "system",
            "content": (
                "You are Fyntellect, an AI financial assistant for Indian businesses. "
                "Help users understand spending, forecast cashflow, manage budgets and research stocks. "
                "Always use ₹ for amounts. Be concise, specific with numbers.\n\n"
                + context
            )
        },
        {"role": "user", "content": message}
    ]

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    resp = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "tools": TOOLS,
            "tool_choice": "auto",
            "max_tokens": 1024
        }
    )

    result = resp.json()
    choice = result["choices"][0]["message"]

    if not choice.get("tool_calls"):
        return choice["content"]

    messages.append(choice)
    for tool_call in choice["tool_calls"]:
        name = tool_call["function"]["name"]
        args = json.loads(tool_call["function"]["arguments"] or "{}")
        tool_result = call_tool(name, args, user_id)
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call["id"],
            "content": str(tool_result)
        })

    final = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "max_tokens": 1024
        }
    )
    return final.json()["choices"][0]["message"]["content"]