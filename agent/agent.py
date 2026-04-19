import os
import json
import requests
from dotenv import load_dotenv
from tools.spending import analyse_spending
from tools.cashflow import forecast_cashflow
from tools.memory import (
    set_budget, get_budget, get_all_budgets,
    sync_transactions, search_transactions
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
            "description": "Analyse spending breakdown by category. Use when user asks about expenses, spending summary, how much they spent.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "forecast_cashflow",
            "description": "Predict next month spending based on past 3 months.",
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
            "description": "Get budget for a specific category.",
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
            "description": "Get all configured budgets across all categories.",
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

def build_context(user_id: str, message: str) -> str:
    """
    1. Fetch transactions from MongoDB (source of truth)
    2. Sync them to Pinecone
    3. Search Pinecone for relevant ones
    4. Get budgets from Pinecone
    5. Return as context string
    """
    try:
       
        raw = get_transaction(user_id)
        print(f"[Context] MongoDB returned {len(raw)} transactions")

        
        if raw:
            sync_transactions(user_id, raw)

        
        relevant = search_transactions(user_id, message, top_k=8)
        print(f"[Context] Pinecone returned {len(relevant)} relevant transactions")

        
        if raw:
            total = sum(t.get("amount", 0) for t in raw)
            cats = {}
            for t in raw:
                c = t.get("category", "unknown")
                cats[c] = cats.get(c, 0) + t.get("amount", 0)
            cat_str = " | ".join([f"{k}: ₹{v:,.0f}" for k, v in
                                   sorted(cats.items(), key=lambda x: x[1], reverse=True)])
            txn_summary = f"Total: ₹{total:,.0f} across {len(raw)} transactions | {cat_str}"
        else:
            txn_summary = "No transactions found in database"

        
        if relevant:
            rel_str = "\n".join([f"  - {t.get('text', '')}" for t in relevant])
        else:
            rel_str = "  None found"

        
        budgets = get_all_budgets(user_id)
        if budgets:
            budget_str = " | ".join([
                f"{b['category']}: ₹{b['amount']:,.0f}" for b in budgets
            ])
        else:
            budget_str = "No budgets configured"

        context = f"""
=== USER FINANCIAL CONTEXT ===
ALL TRANSACTIONS: {txn_summary}

MOST RELEVANT TRANSACTIONS FOR THIS QUERY:
{rel_str}

CONFIGURED BUDGETS: {budget_str}
=============================="""

        print(f"[Context] Built successfully")
        return context

    except Exception as e:
        print(f"[Context] ERROR: {e}")
        import traceback
        traceback.print_exc()
        return "Financial context temporarily unavailable."

def run_agent(user_id: str, message: str, history: list = []) -> str:
    
    context = build_context(user_id, message)

    system = {
        "role": "system",
        "content": (
            "You are Fyntellect, an AI financial assistant for Indian businesses. "
            "Help users understand spending, manage budgets and research stocks. "
            "Always use ₹ for amounts. Be specific with numbers from the context provided.\n\n"
            + context
        )
    }


    messages = [system] + history + [{"role": "user", "content": message}]

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

   
    print(f"[Agent] Tool calls: {bool(result['choices'][0]['message'].get('tool_calls'))}")

    choice = result["choices"][0]["message"]

    
    if not choice.get("tool_calls"):
        return choice["content"]

    
    messages.append(choice)
    for tool_call in choice["tool_calls"]:
        name = tool_call["function"]["name"]
        args = json.loads(tool_call["function"]["arguments"] or "{}")
        print(f"[Agent] Calling tool: {name} with args: {args}")
        tool_result = call_tool(name, args, user_id)
        print(f"[Agent] Tool result: {str(tool_result)[:100]}")
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