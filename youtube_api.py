import os
import requests
from dotenv import load_dotenv
import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from a .env file
load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def search_youtube_live_videos(artist, city, date, venue):
    """
    Search for a single live concert recording on YouTube with a simplified query.

    Parameters:
    artist (str): The name of the artist.
    city (str): The city where the concert took place.
    date (str): The date of the concert in "DD-MM-YYYY" format.
    venue (str): The venue where the concert took place.

    Returns:
    str: The URL of the first matching YouTube video, or None if no results are found.
    """
    if not YOUTUBE_API_KEY:
        raise ValueError("YOUTUBE_API_KEY is not set. Please check your environment variables.")

    # Convert date from "DD-MM-YYYY" to "MM/DD/YYYY"
    try:
        date_obj = datetime.datetime.strptime(date, "%d-%m-%Y")
        formatted_date = date_obj.strftime("%m/%d/%Y")  # Example: "09/14/2024"
    except ValueError:
        print(f"⚠️ Date parsing failed for '{date}'. Using fallback date format.")  # Log the fallback
        formatted_date = date  # Fallback if parsing fails

    # Simplified search query
    query = f"{artist} live {venue} {city} {formatted_date}"

    url = "https://www.googleapis.com/youtube/v3/search"
    
    print(f"🔍 Searching YouTube for: {query}")  # Debugging

    params = {
        "part": "snippet",
        "q": query,
        "key": YOUTUBE_API_KEY,
        "maxResults": 3,  # Get only 1 result
        "type": "video"
    }

    print(f"📡 Request URL: {url}")
    print(f"📄 Request Params: {params}")

    response = requests.get(url, params=params)

    print(f"📬 Response Status Code: {response.status_code}")
    print(f"📬 Response Text: {response.text}")

    if response.status_code == 200:
        results = response.json().get("items", [])
        print(f"📊 Results: {results}")
        video_links = []
        for video in results:
            video_link = f"https://www.youtube.com/watch?v={video['id']['videoId']}"
            print(f"✅ Found video: {video_link}")  # Debugging
            video_links.append(video_link)
        if video_links:
            return video_links  # Return all matching videos
    else:
        print("YouTube API Error:", response.status_code, response.text)
        return None

    print(f"❌ No results found for {artist} at {venue} on {formatted_date}")
    return None
