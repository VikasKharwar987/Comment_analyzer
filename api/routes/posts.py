from fastapi import APIRouter
from api.services.reddit_service import get_posts

router = APIRouter()

@router.get("/posts")
def fetch_posts():
    return get_posts()