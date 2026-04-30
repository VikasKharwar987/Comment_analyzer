import requests
import os
from config import THRESHOLD

API_URL = "https://api-inference.huggingface.co/models/Kharwar1011/toxicity-model-v1"

headers = {
    "Authorization": f"Bearer {os.getenv('HF_TOKEN')}"
}


def predict(text):
    payload = {
        "inputs": text
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    result = response.json()

    # 🔥 DEBUG (optional)
    print("HF Response:", result)

    try:
        scores = result[0]

        toxic_prob = 0

        for item in scores:
            if item["label"] == "LABEL_1":
                toxic_prob = item["score"]

        label = "Toxic" if toxic_prob > THRESHOLD else "Safe"

        return {
            "label": label,
            "confidence_score": round(toxic_prob, 5)
        }

    except Exception:
        return {
            "label": "Error",
            "confidence_score": 0
        }