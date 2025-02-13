from flask import Flask, jsonify, request
import requests
import os
from set_listfm_api import get_attended_concerts, attach_youtube_links, get_youtube_links_for_concert
from dotenv import load_dotenv
from flask_cors import CORS  # Add CORS support

# Load environment variables
load_dotenv()
API_KEY = os.getenv("SETLISTFM_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.secret_key = os.getenv("FLASK_SECRET_KEY")

# API endpoint to get concerts for a username
@app.route("/api/concerts")
def get_concerts():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Username parameter is required"}), 400
    
    concerts = get_attended_concerts(username)
    if concerts is None:
        return jsonify({"error": "Failed to fetch concerts"}), 500
    
    return jsonify({"concerts": concerts})

# API endpoint to get YouTube videos for a specific concert
@app.route("/api/concert/videos")
def get_concert_videos():
    artist = request.args.get("artist")
    venue = request.args.get("venue")
    city = request.args.get("city")
    date = request.args.get("date")
    
    if not artist or not venue or not city or not date:
        return jsonify({"error": "Missing required parameters"}), 400
    
    video_links = get_youtube_links_for_concert(artist, city, date, venue)
    if video_links is None:
        return jsonify({"error": "Failed to fetch YouTube links"}), 500
    
    return jsonify({"youtube_links": video_links})

if __name__ == "__main__":
    app.run(debug=True)



