# import requests
# import os
# from config import THRESHOLD

# API_URL = "https://api-inference.huggingface.co/models/Kharwar1011/toxicity-model-v1"

# headers = {
#     "Authorization": f"Bearer {os.getenv('HF_TOKEN')}"
# }


# def predict(text):
#     try:
#         response = requests.post(API_URL, headers=headers, json={"inputs": text})
#         print("STATUS:", response.status_code)
#         print("RAW:", response.text[:200])
#         print("API_URL USED:", API_URL)

#         if response.status_code != 200 or not response.text.strip():
#             return {
#                 "label": "Error",
#                 "confidence_score": 0.0
#             }

#         try:
#             result = response.json()
#         except Exception:
#             return {
#                 "label": "Error",
#                 "confidence_score": 0.0
#             }
#         scores = result[0]

#         toxic_prob = 0

#         for item in scores:
#             if item["label"] == "LABEL_1":
#                 toxic_prob = item["score"]

#         label = "Toxic" if toxic_prob > THRESHOLD else "Safe"

#         return {
#             "label": label,
#             "confidence_score": round(toxic_prob, 5)
#         }

#     except Exception as e:
#         print("ERROR:", str(e))
#         return {
#             "label": "Error",
#             "confidence_score": 0.0
#         }

from gradio_client import Client

client = Client("Kharwar1011/toxicity-detector-api")

def predict(text):
    try:
        result = client.predict(
            text=text,
            api_name="/predict"
        )

        # mapping
        label_map = {
            "LABEL_0": "Safe",
            "LABEL_1": "Toxic"
        }

        result["label"] = label_map.get(result["label"], result["label"])

        return result

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "label": "Error",
            "confidence_score": 0.0
        }