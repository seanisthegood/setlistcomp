import requests
import os
from dotenv import load_dotenv
from youtube_api import search_youtube_live_videos
import time
import logging

# Load environment variables
load_dotenv()

API_KEY = os.getenv("SETLISTFM_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")

logger = logging.getLogger(__name__)

def get_attended_concerts(username, max_pages=10):
    """
    Fetch attended concerts for a user with pagination support
    Args:
        username (str): Setlist.fm username
        max_pages (int): Maximum number of pages to fetch (default: 10)
    Returns:
        list: List of concert dictionaries or None if error
    """
    all_concerts = []
    current_page = 1

    while current_page <= max_pages:
        url = f"https://api.setlist.fm/rest/1.0/user/{username}/attended?p={current_page}"
        headers = {
            "x-api-key": API_KEY,
            "Accept": "application/json",
            "User-Agent": USER_AGENT
        }
        
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 404:
                break  # No more pages
            
            response.raise_for_status()
            data = response.json()
            
            if not data.get("setlist"):
                break  # No more concerts
                
            all_concerts.extend(data["setlist"])
            current_page += 1
            
            # Add a small delay to respect rate limits
            time.sleep(0.5)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching concerts: {str(e)}")
            return None
            
    return all_concerts

def attach_youtube_links(concerts):
    """Attach YouTube links to each concert in the list."""
    for concert in concerts:
        artist = concert["artist"]["name"]
        date = concert["eventDate"]
        city = concert["venue"]["city"]["name"]  # ✅ Extract city
        venue = concert["venue"]["name"]         # ✅ Extract venue
        
        # Fetch actual YouTube links
        video_links = search_youtube_live_videos(artist, city, date, venue)
        if video_links is None:
            video_links = []
        else:
            for link in video_links:
                print(link)

        concert["youtube_links"] = video_links  # Attach YouTube links

    return concerts

def get_youtube_links_for_concert(artist, city, date, venue):
    """Fetch YouTube links for a specific concert."""
    video_links = search_youtube_live_videos(artist, city, date, venue)
    return video_links

