import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from config import MODEL_PATH, DEVICE, THRESHOLD

device = torch.device(DEVICE if torch.cuda.is_available() else "cpu")

tokenizer = DistilBertTokenizer.from_pretrained(MODEL_PATH)
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)

model.to(device)
model.eval()

def predict(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True
    )

    inputs = {k : v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.softmax(outputs.logits, dim=1)
    toxic_prob = probs[0][1].item()

    label = "Toxic" if toxic_prob > THRESHOLD else "Safe"

    return {
        "label": label,
        "confidence_score": round(toxic_prob,5)
    }