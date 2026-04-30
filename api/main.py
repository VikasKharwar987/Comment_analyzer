from fastapi import FastAPI
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "src"))


from predict import predict
from pydantic import BaseModel
from api.routes.posts import router as posts_router
from api.routes.analyze import router as analyze_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputText(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "API is working"}

@app.post("/predict")
def predict_api(data: InputText):
    result = predict(data.text)
    return result

app.include_router(posts_router)
app.include_router(analyze_router)

