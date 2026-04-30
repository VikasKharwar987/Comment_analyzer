import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", "src"))

from predict import predict

def analyze_comment(comments):
    toxic = 0
    result = []
    for c in comments:
        res  = predict(c)
        if res["label"] == "Toxic":
            toxic += 1
            
        conf = res["confidence_score"]
        if res["label"] == "Safe":
            conf = 1.0 - conf
            
        result.append({
            "text": c,
            "label": res["label"],
            "confidence": conf
        })

    return {
        "total": len(comments),
        "toxic": toxic,
        "safe": len(comments) - toxic,
        "details": result
    }