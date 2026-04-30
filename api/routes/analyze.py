from fastapi import APIRouter
from api.services.reddit_service import get_comments
from api.services.analysis_service import analyze_comment

router = APIRouter()

@router.get("/analyze/{post_id}")
def analyze_post(post_id: str):
    comments = get_comments(post_id)
    return analyze_comment(comments) 