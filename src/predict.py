from gradio_client import Client

client = Client("Kharwar1011/toxicity-detector-api")


def predict_batch(texts):
    try:
        results = client.predict(
            texts,
            api_name="/predict"
        )

        label_map = {
            "LABEL_0": "Safe",
            "LABEL_1": "Toxic"
        }

        formatted = []
        for res in results:
            label = label_map.get(res.get("label"), res.get("label"))

            formatted.append({
                "label": label,
                "confidence_score": res.get("confidence_score", 0.0)
            })

        return formatted

    except Exception as e:
        print("ERROR:", str(e))
        return [{"label": "Error", "confidence_score": 0.0}] * len(texts)