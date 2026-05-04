from fastapi import APIRouter
from api.services.youtube_service import fetch_youtube_comments

router = APIRouter()

@router.get("/posts")
def fetch_comments():
    return fetch_youtube_comments()