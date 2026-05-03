import requests
import concurrent.futures

# 🔥 Your deployed API URL
API_URL = "https://kharwar1011-toxicity-api.hf.space/predict"


# 🔹 Create batches
def create_batches(data, batch_size=50):
    for i in range(0, len(data), batch_size):
        yield data[i:i + batch_size]


# 🔹 Call your HF Space API
def predict_batch_api(batch):
    try:
        response = requests.post(
            API_URL,
            json={"comments": [c["text"] for c in batch]},
            timeout=60
        )
        return response.json().get("results", [])
    except Exception as e:
        print("API Error:", e)
        return []


# 🔹 Main function
def analyze_comments(comments, batch_size=50, max_workers=3):
    comments = comments[:500]  # 🔥 limit to top 500

    toxic = 0
    mild_toxic = 0
    results = []

    batches = list(create_batches(comments, batch_size))

    print(f"Total comments: {len(comments)}")
    print(f"Total batches: {len(batches)}")

    # 🔥 Parallel batch requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        batch_predictions = list(executor.map(predict_batch_api, batches))

    # 🔹 Process results
    for batch, preds in zip(batches, batch_predictions):
        for comment_obj, res in zip(batch, preds):
            confidence = res.get("toxic_score", 0.0)

            if confidence >= 0.7:
                label = "TOXIC"
                toxic += 1
            elif confidence >= 0.3:
                label = "MILD TOXIC"
                mild_toxic += 1
            else:
                label = "SAFE"

            results.append({
                "text": comment_obj["text"],
                "timestamp": comment_obj["timestamp"],
                "label": label,
                "confidence": confidence
            })

    return {
        "total": len(comments),
        "toxic": toxic,
        "mild_toxic": mild_toxic,
        "safe": len(comments) - toxic - mild_toxic,
        "details": results
    }