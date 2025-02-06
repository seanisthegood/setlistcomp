from flask import Flask, jsonify, render_template, request, session
import requests
import os
from youtube_api import search_youtube_live_videos
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("SETLISTFM_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")



app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

def get_attended_concerts(username):
    """Fetch all attended concerts from Setlist.fm and attach YouTube links."""
    
    if session.get("concerts") and session.get("username") == username:
        print(f"Using cached concerts from session: {len(session['concerts'])} concerts")
        return session["concerts"]

    page = 1
    all_concerts = []

    while True:
        url = f"https://api.setlist.fm/rest/1.0/user/{username}/attended?p={page}"
        headers = {
            "x-api-key": os.getenv("SETLISTFM_API_KEY"),
            "Accept": "application/json",
            "User-Agent": os.getenv("USER_AGENT")
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

        for concert in concerts:
            artist = concert["artist"]["name"]
            city = concert["venue"]["city"]["name"]
            venue = concert["venue"]["name"]  # Get venue name
            date = concert["eventDate"]
            
            # Fetch YouTube videos for the concert
            # youtube_links = search_youtube_live_videos(artist, city, date, venue)
            # concert["youtube_links"] = youtube_links  # Attach links to the concert

        all_concerts.extend(concerts)
        print(f"Fetched page {page} of {total_pages}")

        if page >= total_pages:
            break

        page += 1

    session["concerts"] = all_concerts
    session["username"] = username
    print(f"Total concerts stored in session: {len(all_concerts)}")

    return all_concerts


# Route to display concerts
@app.route("/")
def index():
    username = request.args.get("username", "your_setlistfm_username")  # Replace default username
    concerts = get_attended_concerts(username)

    if concerts:
        return render_template("concerts.html", concerts=concerts, username=username)
    else:
        return "No concerts found or an error occurred."

if __name__ == "__main__":
    app.run(debug=True)



