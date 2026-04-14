import os
import json
import requests
from dotenv import load_dotenv
from tools.spending import analyse_spending
from tools.cashflow import forecast_cashflow
from tools.memory import (
    set_budget, get_budget, get_all_budgets,
    search_transactions, store_chat_message,
    get_relevant_history, sync_transactions_to_pinecone
)
from tools.stocks import search_stock_news
from db import get_transaction

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "analyse_spending",
            "description": "Analyse full spending breakdown by category and totals. Use when user asks about expenses, spending summary, how much they spent.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "forecast_cashflow",
            "description": "Predict next month spending based on past 3 months trend.",
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
                    "category": {
                        "type": "string",
                        "enum": ["marketing", "development", "testing", "legal"]
                    },
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
                "properties": {"category": {"type": "string"}},
                "required": ["category"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_all_budgets",
            "description": "Get all configured budget limits across all categories.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_stock_news",
            "description": "Search latest stock/market news.",
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

def build_context(user_id: str, current_message: str) -> str:
    """Build full financial context from Pinecone + MongoDB"""
    try:
        # Sync latest MongoDB transactions to Pinecone
        raw_transactions = get_transaction(user_id)
        if raw_transactions:
            sync_transactions_to_pinecone(user_id, raw_transactions)

        # Search relevant transactions for current question
        relevant_txns = search_transactions(user_id, current_message, top_k=8)

        # Build transaction summary from MongoDB
        if raw_transactions:
            total = sum(t.get("amount", 0) for t in raw_transactions)
            cats = {}
            for t in raw_transactions:
                cat = t.get("category", "unknown")
                cats[cat] = cats.get(cat, 0) + t.get("amount", 0)
            cat_str = " | ".join([f"{k}: ₹{v:,.0f}" for k, v in cats.items()])
            txn_summary = f"Total: ₹{total:,.0f} across {len(raw_transactions)} transactions. By category: {cat_str}"
        else:
            txn_summary = "No transactions found"

        # Relevant transactions for this specific question
        if relevant_txns:
            relevant_str = "\n".join([
                f"- {t.get('text', '')}" for t in relevant_txns[:5]
            ])
        else:
            relevant_str = "None found"

        # Budget context
        budgets = get_all_budgets(user_id)
        budget_str = " | ".join([
            f"{b['category']}: ₹{b['amount']:,.0f}" for b in budgets
        ]) if budgets else "No budgets set"

        return f"""
=== FYNTELLECT FINANCIAL CONTEXT ===
TRANSACTION SUMMARY: {txn_summary}

RELEVANT TRANSACTIONS FOR THIS QUERY:
{relevant_str}

CONFIGURED BUDGETS: {budget_str}
===================================="""

    except Exception as e:
        print(f"Context error: {e}")
        return "Financial context temporarily unavailable."

def run_agent(user_id: str, message: str) -> str:
    # Get relevant chat history from Pinecone
    history = get_relevant_history(user_id, message, top_k=6)

    # Build financial context
    context = build_context(user_id, message)

    messages = [
        {
            "role": "system",
            "content": (
                "You are Fyntellect, an AI financial assistant for Indian businesses. "
                "Help users understand spending, manage budgets and research stocks. "
                "Always use ₹ for amounts. Be specific with numbers from the context.\n\n"
                + context
            )
        }
    ] + history + [
        {"role": "user", "content": message}
    ]

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    # First call
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
        answer = choice["content"]
    else:
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
        answer = final.json()["choices"][0]["message"]["content"]

    # Store this exchange in Pinecone memory
    store_chat_message(user_id, "user", message)
    store_chat_message(user_id, "assistant", answer)

    return answer