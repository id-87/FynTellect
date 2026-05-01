from ddgs import DDGS

def search_stock_news(stock_name: str, market: str = "global") -> dict:
    try:
        if market == "india":
            query = f"{stock_name} stock NSE BSE India"
        else:
            query = f"{stock_name} stock price news"

        with DDGS() as ddgs:
            results = list(ddgs.news(query, max_results=5))

        if not results:
            # Fallback — try text search
            with DDGS() as ddgs:
                results = [r for r in ddgs.text(query, max_results=5)]
                return {
                    "stock": stock_name,
                    "market": market,
                    "news": [{"title": r.get("title",""), "body": r.get("body","")} for r in results]
                }

        return {
            "stock": stock_name,
            "market": market,
            "news": [{"title": r.get("title",""), "body": r.get("body",""), "date": r.get("date","")} for r in results]
        }

    except Exception as e:
        return {"stock": stock_name, "market": market, "news": [], "error": str(e)}