from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from api.routes.posts import router as posts_router
from api.routes.analyze import router as analyze_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://toxicitycommentanalyzer-7zxneixnh.vercel.app",
        "*"
    ],
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
    from predict import predict  # lazy import (better)
    return predict(data.text)

# 🔥 include routers
app.include_router(posts_router)
app.include_router(analyze_router)