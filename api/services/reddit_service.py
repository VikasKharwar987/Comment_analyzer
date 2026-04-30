import requests

HEADERS = {
    'User-Agent': "toxicity_analyser_app"
}

def get_posts(subreddit="AskReddit"):
    url = f"https://www.reddit.com/r/{subreddit}.json"
    res  = requests.get(url, headers=HEADERS)

    data = res.json()

    posts = []
    for post in data["data"]["children"]:
        p = post["data"]
        posts.append({
            "id": p["id"],
            "title": p["title"],
            "image":p.get("thumbnail"),
            "url": p.get("url")
        })
    return posts

def get_comments(post_id):
    url=f"https://www.reddit.com/comments/{post_id}.json"
    res = requests.get(url, headers = HEADERS)
    data = res.json()
    comments = []
    for c in data[1]["data"]["children"]:
        if c["kind"] == "t1":
            comments.append(c["data"]["body"])

    
    return comments