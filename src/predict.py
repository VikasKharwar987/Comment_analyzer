import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from config import MODEL_PATH, THRESHOLD

DEVICE = "cpu"
device = torch.device(DEVICE)

tokenizer = None
model = None

def load_model():
    global tokenizer, model

    if tokenizer is None or model is None:
        print("🔄 Loading model...")

        tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
        model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)

        model.to(device)
        model.eval()

        print("✅ Model loaded successfully")

def predict(text):
    load_model()

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.softmax(outputs.logits, dim=1)
    toxic_prob = probs[0][1].item()

    label = "Toxic" if toxic_prob > THRESHOLD else "Safe"

    return {
        "label": label,
        "confidence_score": round(toxic_prob, 5)
    }