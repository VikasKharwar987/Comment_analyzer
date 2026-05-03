import aiohttp
import asyncio
from urllib.parse import urlparse, parse_qs
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("YT_TOKEN")


# 🔹 Extract video ID
def get_video_id(url: str):
    parsed_url = urlparse(url)

    if parsed_url.hostname == "youtu.be":
        return parsed_url.path[1:]

    if parsed_url.hostname in ("www.youtube.com", "youtube.com"):
        return parse_qs(parsed_url.query).get("v", [None])[0]

    return None


# 🔹 Fetch top comments (returns LIST OF TEXT ONLY)
async def fetch_youtube_comments(video_url, max_comments=500):
    video_id = get_video_id(video_url)

    if not video_id:
        raise ValueError("Invalid YouTube URL")

    base_url = "https://www.googleapis.com/youtube/v3/commentThreads"

    comments = []
    next_page_token = None

    async with aiohttp.ClientSession() as session:
        while len(comments) < max_comments:
            params = {
                "part": "snippet",
                "videoId": video_id,
                "key": API_KEY,
                "maxResults": 100,
                "textFormat": "plainText",
                "order": "relevance"
            }

            if next_page_token:
                params["pageToken"] = next_page_token

            async with session.get(base_url, params=params) as resp:
                if resp.status != 200:
                    print("YouTube API Error:", await resp.text())
                    break

                data = await resp.json()

                if "items" not in data:
                    break

                for item in data["items"]:
                    snippet = item["snippet"]["topLevelComment"]["snippet"]

                    text = snippet["textDisplay"].strip()
                    timestamp = snippet.get("publishedAt", "")

                    comments.append({"text": text, "timestamp": timestamp})

                next_page_token = data.get("nextPageToken")

                if not next_page_token:
                    break

    return comments[:max_comments]