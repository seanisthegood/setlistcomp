from flask import Flask, jsonify, request, send_from_directory
import os
from set_listfm_api import get_attended_concerts, get_youtube_links_for_concert
from dotenv import load_dotenv
from flask_cors import CORS  # Enable CORS for API calls
import logging

# Load environment variables
load_dotenv()
API_KEY = os.getenv("SETLISTFM_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")

# Initialize Flask app
app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)  # Enable CORS for all routes

app.secret_key = os.getenv("FLASK_SECRET_KEY")

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# 📌 Serve React's index.html for the root URL
@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")

# 📌 Serve React's index.html for unknown routes (fixes React Router issues)
@app.route("/<path:path>")
def serve_static_files(path):
    if os.path.exists(os.path.join(app.static_folder, path)):  # If file exists, serve it
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")  # Otherwise, serve React

# 📌 API endpoint to get concerts for a username
@app.route("/api/concerts")
def get_concerts():
    username = request.args.get("username")
    if not username:
        return jsonify({"error": "Username parameter is required"}), 400
    
    # Fetch all concerts
    concerts = get_attended_concerts(username, max_pages=10)  # Adjust max_pages as needed
    if concerts is None:
        return jsonify({"error": "Failed to fetch concerts"}), 500
    
    return jsonify({"concerts": concerts})

# 📌 API endpoint to get YouTube videos for a concert
@app.route("/api/concert/videos")
def get_concert_videos():
    try:
        logger.debug(f"Received request with params: {request.args}")
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
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

# 📌 Ensure Flask runs on Heroku’s assigned port
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
