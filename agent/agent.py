import os
import json
import requests
from dotenv import load_dotenv
from db import get_transaction, get_monthly_transaction
from tools.spending import analyse_spending
from tools.cashflow import forecast_cashflow
from tools.budget import set_budget, get_budget
from tools.stocks import search_stock_news

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Define tools for Groq
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "analyse_spending",
            "description": "Analyse spending breakdown by category. Use when user asks about expenses, spending, how much they spent.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "forecast_cashflow",
            "description": "Predict next month spending based on past 3 months. Use when user asks about predictions, forecasts, next month budget.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_budget",
            "description": "Set a budget limit for a category.",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {"type": "string", "description": "The category name"},
                    "amount": {"type": "number", "description": "Budget amount in rupees"}
                },
                "required": ["category", "amount"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_budget",
            "description": "Get budget for a category.",
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
            "name": "search_stock_news",
            "description": "Search stock news. Use when user asks about stocks, markets, investments.",
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

def call_tool(name, args, user_id):
    if name == "analyse_spending":
        return analyse_spending(user_id)
    elif name == "forecast_cashflow":
        return forecast_cashflow(user_id)
    elif name == "set_budget":
        return set_budget(user_id, args["category"], args["amount"])
    elif name == "get_budget":
        return get_budget(user_id, args["category"])
    elif name == "search_stock_news":
        return search_stock_news(args["stock_name"], args.get("market", "global"))
    return "Tool not found"

def run_agent(user_id: str, message: str) -> str:
    messages = [
        {
            "role": "system",
            "content": "You are FinOS, an AI financial assistant for Indian businesses. Help users understand spending, forecast cashflow, manage budgets and research stocks. Use rupees (₹). Be concise and helpful."
        },
        {"role": "user", "content": message}
    ]

    # First call — let Groq decide which tool to use
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "tools": TOOLS,
            "tool_choice": "auto"
        }
    )

    result = response.json()
    choice = result["choices"][0]["message"]

    # If no tool call — return direct response
    if not choice.get("tool_calls"):
        return choice["content"]

    # Execute tool calls
    messages.append(choice)

    for tool_call in choice["tool_calls"]:
        tool_name = tool_call["function"]["name"]
        tool_args = json.loads(tool_call["function"]["arguments"] or "{}")
        tool_result = call_tool(tool_name, tool_args, user_id)

        messages.append({
            "role": "tool",
            "tool_call_id": tool_call["id"],
            "content": str(tool_result)
        })

    # Second call — generate final answer with tool results
    final_response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": messages
        }
    )

    return final_response.json()["choices"][0]["message"]["content"]