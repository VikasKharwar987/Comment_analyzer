import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", "src"))

from predict import predict
import concurrent.futures

def analyze_comment(comments):
    toxic = 0
    result = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        predictions = list(executor.map(predict, comments))
        
    for c, res in zip(comments, predictions):
        if res.get("label") == "Toxic":
            toxic += 1
            
        conf = res.get("confidence_score", 0.0)
            
        result.append({
            "text": c,
            "label": res.get("label", "Error"),
            "confidence": conf
        })

    return {
        "total": len(comments),
        "toxic": toxic,
        "safe": len(comments) - toxic,
        "details": result
    }