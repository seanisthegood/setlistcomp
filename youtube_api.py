import os
import requests
from dotenv import load_dotenv
import datetime

load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def search_youtube_live_videos(artist, city, date, venue):
    """Search for a single live concert recording on YouTube with improved query formatting."""
    
    # Convert date from "DD-MM-YYYY" to "MM/DD/YYYY"
    try:
        date_obj = datetime.datetime.strptime(date, "%d-%m-%Y")
        formatted_date = date_obj.strftime("%m/%d/%Y")  # Example: "09/14/2024"
    except ValueError:
        formatted_date = date  # Fallback if parsing fails

    # Generate search queries that better match YouTube's style
    search_queries = [
        f"{artist} @ {venue}, {city} - {formatted_date} full set",  # Closest match
        f"{artist} live at {venue} {formatted_date}",
        f"{artist} {venue} {formatted_date} full concert",
        f"{artist} live {city} {formatted_date}"
    ]

    url = "https://www.googleapis.com/youtube/v3/search"
    
    for query in search_queries:
        print(f"🔍 Searching YouTube for: {query}")  # Debugging

        params = {
            "part": "snippet",
            "q": query,
            "key": YOUTUBE_API_KEY,
            "maxResults": 1,  # Get only ONE result
            "type": "video"
        }

        response = requests.get(url, params=params)

        if response.status_code == 200:
            results = response.json().get("items", [])
            if results:
                video = results[0]
                video_link = f"https://www.youtube.com/watch?v={video['id']['videoId']}"
                print(f"✅ Found video: {video_link}")  # Debugging
                return video_link  # Return the first matching video
        else:
            print("YouTube API Error:", response.status_code, response.text)
            return None

    print(f"❌ No results found for {artist} at {venue} on {formatted_date}")
    return None
