import requests
import os
from dotenv import load_dotenv
from youtube_api import search_youtube_live_videos

# Load environment variables
load_dotenv()

API_KEY = os.getenv("SETLISTFM_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")

def get_attended_concerts(username, cache=None):
    """
    Fetch all attended concerts from Setlist.fm.
    If a cache (dict) is provided, use it to store/retrieve results.
    """

    # Use cache if provided
    if cache and cache.get("username") == username:
        print(f"Using cached concerts: {len(cache['concerts'])} concerts")
        return cache["concerts"]

    page = 1
    all_concerts = []

    while True:
        url = f"https://api.setlist.fm/rest/1.0/user/{username}/attended?p={page}"
        headers = {
            "x-api-key": API_KEY,
            "Accept": "application/json",
            "User-Agent": USER_AGENT
        }

        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print("Error:", response.status_code, response.text)
            return None

        data = response.json()
        concerts = data.get("setlist", [])
        total_pages = data.get("totalPages", 1)

        if not concerts:
            break

        all_concerts.extend(concerts)
        print(f"Fetched page {page} of {total_pages}")

        if page >= total_pages:
            break

        page += 1

    # Cache results if cache is provided
    if cache is not None:
        cache["concerts"] = all_concerts
        cache["username"] = username

    print(f"Total concerts fetched: {len(all_concerts)}")
    return all_concerts

def attach_youtube_links(concerts):
    """Attach YouTube links to each concert in the list."""
    for concert in concerts:
        artist = concert["artist"]["name"]
        date = concert["eventDate"]
        city = concert["venue"]["city"]["name"]  # ✅ Extract city
        venue = concert["venue"]["name"]         # ✅ Extract venue
        
        # Fetch actual YouTube links
        youtube_links = search_youtube_live_videos(artist, city, date, venue)
        print(f"Found YouTube link: {youtube_links}")

        concert["youtube_links"] = youtube_links  # Attach YouTube links

    return concerts

