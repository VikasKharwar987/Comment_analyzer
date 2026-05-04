from fastapi import APIRouter

from api.services.youtube_service import fetch_youtube_comments
from api.services.analysis_service import analyze_comments

router = APIRouter()

@router.get("/analyze")
async def analyze_post(video_url: str):
    comments = await fetch_youtube_comments(video_url)
    result = analyze_comments(comments)
    return result