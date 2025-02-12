import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");  // Store user input
  const [concerts, setConcerts] = useState([]);  // Store concerts
  const [error, setError] = useState("");        // Store errors

  // Function to fetch concerts from Flask API
  const fetchConcerts = () => {
    if (!username) {
      setError("Enter your Setlist.fm username!");
      return;
    }

    fetch(`http://127.0.0.1:5000/api/concerts?username=${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setConcerts([]); // Clear concerts if there's an error
        } else {
          setConcerts(data.concerts);
          setError(""); // Clear errors if successful
        }
      })
      .catch(() => setError("Error fetching concerts."));
  };

  return (
    <div>
      <h1>Find Your Attended Concerts</h1>

      {/* Input field for username */}
      <input
        type="text"
        placeholder="Enter your Setlist.fm username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={fetchConcerts}>Fetch Concerts</button>

      {/* Display error messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display concert list */}
      <ul>
  {concerts.map((concert, index) => (
    <li key={index}>
      <strong>{concert.artist.name}</strong> - {concert.eventDate} <br />
      {concert.venue.name}, {concert.venue.city.name}
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;
