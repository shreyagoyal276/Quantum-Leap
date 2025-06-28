from flask import Flask, jsonify
import requests
import time
from pymongo import MongoClient
from bson.json_util import dumps
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)


import pickle
tfidf= pickle.load(open("vectorizer.pkl",'rb'))
model= pickle.load(open("model.pkl",'rb'))

@app.route("/clear-news")
def clear_news():
    result = collection.delete_many({})
    return jsonify({"message": "🧹 All news cleared!", "deleted_count": result.deleted_count})



def predict_news(message):
    
    imp_words = [
    "strike", "protest", "lockout","landslide","floods","flood","streets", "viruses","shutdown", "agitation",
    "retailers", "shopkeepers", "traders", "kirana",
    "vendor", "hawkers", "businessmen", "retail", "store", "ban",
    "curfew", "crackdown", "shutdown",
    "festival", "inventory"]

    is_correct = any(word in message.lower() for word in imp_words)
    if is_correct:
        return 1
    
    transformed_message=tfidf.transform([message])
    if model.predict(transformed_message)[0]==0:
        print("not related")
        return 0
    else:
        print("related")
        return 1



GNEWS_API_KEY = "enter-your-key"
FETCH_INTERVAL = 15 * 60  # 15 minutes
last_fetched_time = 0
cached_news = []

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["news_db"]
collection = db["important_news"]

# Check for duplicates by title
def is_duplicate(title):
    return collection.find_one({"title": title}) is not None

# Save if not duplicate
def save_news(news_item):
    if not is_duplicate(news_item.get("title", "")):
        print("✅ News article saved to MongoDB:", news_item.get('title'))
        collection.insert_one(news_item)

# Fetch real-time and filter important news
@app.route("/realtime-news")
def get_filtered_news():
    print("🔁 Fetching new news from API...")
    global last_fetched_time, cached_news

    now = time.time()
    if now - last_fetched_time < FETCH_INTERVAL:
        print("Returning cached news")
        return jsonify(cached_news)

    print("Fetching fresh news")
    url = f"https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=20&token={GNEWS_API_KEY}"

    try:
        res = requests.get(url)
        news_data = res.json()
        print("📦 Got data from API:", news_data)
        articles = res.json().get("articles", [])

        filtered = []
        for article in articles:
            title = str(article.get("title", ""))
            try:
                if predict_news(title) == 1:
                    save_news(article)
                    article['_id'] = str(ObjectId())
                    filtered.append(article)
            except Exception as e:
                print(f"Error handling article: {e}")
                

        cached_news = filtered
        last_fetched_time = now

        return jsonify(filtered)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get saved filtered news
@app.route("/saved-news")
def get_saved_news():
    data = list(collection.find({}, {'_id': False}))
    return jsonify(data)
    
    
# from flask import Flask, jsonify
# from pymongo import MongoClient
from pytrends.request import TrendReq
import time

# app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["restock-notifier"]
collection = db["stocks"]

# Base keywords for food-related product suggestions
food_base_keywords = [
    "vegetables", "fruits", "milk", "bread", "rice", "wheat",
    "oil", "snacks", "biscuits", "chocolate", "noodles", "beverages",
    "sugar", "salt", "spices", "meat", "eggs", "food", "juice", "grocery"
]

# Noise words (non-product keywords)
noise_words = [
    "grocery","vegetable","vegetables","fruit","chocolate","food","hypoglycemia", "kitchen", "combo", "product", "item", "accessories", "category",
    "brand", "store", "shopping", "attachment", "attack", "sale", "offer",
    "discount", "deal", "flash", "limited", "new", "hot", "trending", "popular",
    "bestseller", "giveaway", "free", "clearance", "bonus", "bumper", "exclusive",
    "hack", "alert", "leak", "scam", "risk", "warning", "recall", "fake", "fraud",
    "ban", "report", "investigation", "exploit", "file", "download", "upload",
    "pdf", "image", "video", "screenshot", "clip", "doc", "link", "post", "viral",
    "meme", "share", "like", "reel", "ovary","status", "tweet", "thread", "dm", "story",
    "review", "rating", "feedback", "experience", "comparison", "unboxing", "test",
    "opinion", "pros", "cons", "suggestion", "survey", "study", "insight", "stats",
    "data", "forecast", "trends", "analysis", "update", "issue", "case", "cover",
    "adapter", "plug", "extension"
]


from datetime import datetime
import re
missing_collection = db["missing_products"]

@app.route('/check-trends', methods=['GET'])
def check_trending_products():
    pytrends = TrendReq(hl='en-US', tz=330)
    suggested_products = set()

    # Step 1: Get suggestions for each base keyword
    print("Fetching suggestions for related products...\n")
    for keyword in food_base_keywords:
        try:
            print(f"➡️ Getting suggestions for: {keyword}")
            suggestions = pytrends.suggestions(keyword)
            for item in suggestions:
                title = item['title'].strip().lower()
                if title.isalpha() or ' ' in title:
                    suggested_products.add(title)
            time.sleep(2)  
        except Exception as e:
            print(f"❌ Error while fetching suggestions for '{keyword}':", e)

    # Convert to sorted list
    product_list = sorted(list(suggested_products))
    print(f"\nTotal unique suggested products: {len(product_list)}")
    print("Sample:", product_list[:10])

    print("\n📈 Fetching trend data (last 7 days)...")
    trending_now = []

    batch_size = 5
    for i in range(0, len(product_list), batch_size):
        batch = product_list[i:i + batch_size]
        try:
            pytrends.build_payload(batch, timeframe='now 7-d', geo='IN')
            data = pytrends.interest_over_time()

            for product in batch:
                if product in data:
                    trend = data[product]
                    if not trend.empty and trend.iloc[-1] > trend.mean():
                        trending_now.append(product)
            time.sleep(1)
        except Exception as e:
            print(f"❌ Error during trend check for {batch}: {e}")

    # Step 2: Filter out noise words
    final_trending = []
    for i in trending_now:
        word_clean = re.sub(r'\W+', ' ', i).strip().lower()
        if word_clean and word_clean not in noise_words:
            final_trending.append(word_clean)

    # Step 3: Fetch inventory from MongoDB
    inventory_cursor = collection.find({}, {"name": 1})
    inventory = set()
    for doc in inventory_cursor:
        if "name" in doc and isinstance(doc["name"], str):
            inventory.add(doc["name"].strip().lower())

    # Step 4: Find trending products missing from inventory
    missing = []
    for item in final_trending:
        if item.lower() not in inventory:
            missing.append(item)
            
         
    if missing:
        missing_collection.insert_one({
            "date": datetime.utcnow(),
            "name": sorted(set(missing))
        })
        
        # Store as individual documents with unique product names
        for item in sorted(set(missing)):
            if item not in noise_words:
                existing  = missing_collection.update_one(
                    {"name": item},
                    {"$set": {"date": datetime.utcnow().isoformat()}},
                    upsert=True  # Insert if not present
                )
                print(f"✅ Inserted new missing item: {item}")

        print("✅ Saved missing items to DB")
    else:
        print("🟢 No new missing products")
        
    print("saved locally")
    return jsonify({
        "products trending now but missing in dataset": sorted(set(missing))
    })



stocks_collection = db["trending_tracker"]


@app.route('/refresh-missing', methods=['POST'])
def refresh_missing_products():
    # Load current inventory
    inventory_cursor = collection.find({}, {"name": 1})
    inventory = set(
    doc["name"].strip().lower()
    for doc in inventory_cursor
    if "name" in doc and isinstance(doc["name"], str))

    if 1==1:
        print("Less than 24 hrs. Validating existing data.")
        # Get previous missing products
        existing = (missing_collection.find({}))
        print("\ninventory")
        for it in inventory:
            print(it)
        still_missing = []
        print("\nearlier missing items")
        for jj in existing:
            for j in jj["name"]:
                if j not in inventory:
                    still_missing.append(j)
                print(j)

        stm=set(still_missing)
        still_missing=list(stm)
        print("\n\nFinal list of missing items:", still_missing)

        return jsonify({
            "source": "cache",
            "missing": still_missing
        })


if __name__ == "__main__":
    app.run(port=8000, debug=True)

# if __name__ == "__main__":
#     app.run(debug=True)

# # MongoDB connection
# client = MongoClient("mongodb://localhost:27017")  # change if using Atlas
# db = client["news_db"]
# collection = db["important_news"]

# # Check if article already exists (by title)
# def is_duplicate(title):
#     return collection.find_one({"title": title}) is not None

# # Save to MongoDB if not duplicate
# def save_news(news_item):
#     if not is_duplicate(news_item.get("title", "")):
#         # After saving a news article
#         print("✅ News article saved to MongoDB:", article['title'])

#         collection.insert_one(news_item)

# @app.route("/realtime-news")
# def get_filtered_news():
#     print("🔁 Fetching new news from API...")
#     global last_fetched_time, cached_news

#     now = time.time()
#     if now - last_fetched_time < FETCH_INTERVAL:
#         print("🟡 Returning cached news")
#         return jsonify(cached_news)

#     print("🟢 Fetching fresh news")
#     url = f"https://newsapi.org/v2/top-headlines?country=in&pageSize=30&apiKey=${NEWS_API_KEY}"
#     print("📦 Got data from API:", news_data)

#     try:
#         res = requests.get(url)
#         articles = res.json().get("articles", [])

#         filtered = []
#         for article in articles:
#             title = article.get("title", "")
#             if predict_news(title) == 1:
#                 print("🧠 Prediction result:", 1)
#                 filtered.append(article)
#                 save_news(article)

#         cached_news = filtered
#         last_fetched_time = now

#         return jsonify(filtered)

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/saved-news")
# def get_saved_news():
#     # use bson.json_util.dumps to convert MongoDB cursor to JSON
#     saved = list(collection.find())
#     for s in saved:
#         s['_id'] = str(s['_id'])  # Convert MongoDB ObjectId to string
#     return jsonify(saved)
# if __name__ == "__main__":
#     app.run(port=8000, debug=True)
