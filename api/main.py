from fastapi import FastAPI
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "src"))


from predict import predict
from pydantic import BaseModel

app = FastAPI()

class InputText(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "API is working"}

@app.post("/predict")
def predict_api(data: InputText):
    result = predict(data.text)
    return result


