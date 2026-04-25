from duckduckgo_search import DDGS

def search_stock_news(stock_name: str, market: str = "global") -> dict:
    try:
        if market == "india":
            query = f"{stock_name} NSE BSE stock news India"
        else:
            query = f"{stock_name} stock news"

        results = []
        with DDGS() as ddgs:
            for r in ddgs.news(query, max_results=5):
                results.append({
                    "title": r.get("title", ""),
                    "body": r.get("body", ""),
                    "source": r.get("source", ""),
                    "date": r.get("date", "")
                })

        return {
            "stock": stock_name,
            "market": market,
            "news": results
        }

    except Exception as e:
        return {
            "stock": stock_name,
            "market": market,
            "news": [],
            "error": str(e)
        }