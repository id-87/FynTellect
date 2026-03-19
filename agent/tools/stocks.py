import requests
def search_stock_news(stock_name,market="global"):
    if market=="india":
        query=f"{stock_name} NSE BSE stock news"
    else:
        query=f"{stock_name} NYSE NASDAQ stock news"
    query = query.replace(" ", "+")

    resp=requests.get(f"https://api.duckduckgo.com/?q={query}&format=json&no_html=1")
    data = resp.json()
    results = data.get("RelatedTopics", [])[:5]
    snippets = [r.get("Text", "") for r in results if "Text" in r]
    
    return {
    "stock": stock_name,
    "market": market,
    "news": snippets
}

