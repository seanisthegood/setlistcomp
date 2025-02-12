from flask import Flask, jsonify, request
import requests
import os
from set_listfm_api import get_attended_concerts, attach_youtube_links
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
    concerts = get_attended_concerts(request.args.get("username"))
    if concerts is None:
        return jsonify({"error": "Failed to fetch concerts"}), 500
    
    # Get the first few concerts with YouTube links
    concerts_with_videos = attach_youtube_links(concerts[0:3])
    return jsonify({"concerts": concerts_with_videos})

if __name__ == "__main__":
    app.run(debug=True)



