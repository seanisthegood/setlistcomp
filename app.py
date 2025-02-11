from flask import Flask, jsonify, render_template, request
import requests
import os
from set_listfm_api import get_attended_concerts, attach_youtube_links
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("SETLISTFM_API_KEY")
USER_AGENT = os.getenv("USER_AGENT")


app = Flask(__name__)

app.secret_key = os.getenv("FLASK_SECRET_KEY")



# Route to display concerts
@app.route("/")
def index():
    username = request.args.get("username", "your_setlistfm_username")  # Replace default username
    concerts = get_attended_concerts(username)
    concerts= attach_youtube_links(concerts[0:3])

    if concerts:
        return render_template("concerts.html", concerts=concerts, username=username)
    else:
        return "No concerts found or an error occurred."

if __name__ == "__main__":
    app.run(debug=True)



