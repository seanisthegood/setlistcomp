import React, { useState, useEffect } from "react";
import Select from "react-select";

function App() {
  const [username, setUsername] = useState("");  // Initialize username state
  const [concerts, setConcerts] = useState([]);  // Initialize concerts state
  const [error, setError] = useState("");        // Initialize error state
  const [selectedVenue, setSelectedVenue] = useState([]);  // Initialize selected venue state
  const [selectedDate, setSelectedDate] = useState([]);    // Initialize selected date state
  const [selectedArtist, setSelectedArtist] = useState([]); // Initialize selected artist state
  const [youtubeLinks, setYoutubeLinks] = useState({});    // Initialize YouTube links state

  // Function to fetch concerts from Flask API
  const fetchConcerts = () => {
    if (!username) {
      setError("Enter your Setlist.fm username!");  // Update error state
      return;
    }

    fetch(`http://127.0.0.1:5000/api/concerts?username=${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);  // Update error state
          setConcerts([]);       // Clear concerts state
        } else {
          setConcerts(data.concerts);  // Update concerts state
          setError("");                // Clear error state
        }
      })
      .catch(() => setError("Error fetching concerts."));  // Update error state
  };

  // Function to search for a concert on YouTube
  const searchYouTube = (concert) => {
    console.log("Concert data:", concert);
    if (!concert || !concert.artist || !concert.venue || !concert.venue.city || !concert.eventDate) {
      console.error("Invalid concert data:", concert);
      return;
    }

    const { artist, venue, eventDate } = concert;
    const city = venue.city.name;
    console.log(`Searching YouTube for: ${artist.name} at ${venue.name} in ${city} on ${eventDate}`);
    fetch(`http://127.0.0.1:5000/api/concert/videos?artist=${artist.name}&venue=${venue.name}&city=${city}&date=${eventDate}`)
      .then(response => response.json())
      .then(data => {
        console.log("YouTube search response:", data);
        if (data.youtube_links) {
          setYoutubeLinks(prevLinks => ({
            ...prevLinks,
            [eventDate]: data.youtube_links.length > 0 ? data.youtube_links : 'No video found'
          }));
        } else {
          setYoutubeLinks(prevLinks => ({
            ...prevLinks,
            [eventDate]: 'No video found'
          }));
        }
      })
      .catch(error => {
        console.error("Error fetching YouTube videos:", error);
        setYoutubeLinks(prevLinks => ({
          ...prevLinks,
          [eventDate]: 'Error fetching video'
        }));
      });
  };

  // Get unique venues, dates, and artists for dropdown menus
  const uniqueVenues = [...new Set(concerts.map(concert => concert.venue.name))];
  const uniqueDates = [...new Set(concerts.map(concert => concert.eventDate))];
  const uniqueArtists = [...new Set(concerts.map(concert => concert.artist.name))];

  // Filter concerts based on selected criteria
  const filteredConcerts = concerts.filter(concert => {
    return (
      (selectedVenue.length === 0 || selectedVenue.some(venue => concert.venue.name === venue.value)) &&
      (selectedDate.length === 0 || selectedDate.some(date => concert.eventDate === date.value)) &&
      (selectedArtist.length === 0 || selectedArtist.some(artist => concert.artist.name === artist.value))
    );
  });

  // Filter options based on selected criteria
  const filteredVenues = uniqueVenues.filter(venue => {
    return (
      selectedArtist.length === 0 ||
      concerts.some(concert => concert.venue.name === venue && selectedArtist.some(artist => concert.artist.name === artist.value))
    );
  });

  const filteredDates = uniqueDates.filter(date => {
    return (
      selectedArtist.length === 0 ||
      concerts.some(concert => concert.eventDate === date && selectedArtist.some(artist => concert.artist.name === artist.value))
    );
  });

  const filteredArtists = uniqueArtists.filter(artist => {
    return (
      selectedVenue.length === 0 ||
      concerts.some(concert => concert.artist.name === artist && selectedVenue.some(venue => concert.venue.name === venue.value))
    );
  });

  return (
    <div>
      <h1>Find Your Attended Concerts</h1>

      {/* Input field for username */}
      <input
        type="text"
        placeholder="Enter your Setlist.fm username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}  // Update username state
      />
      <button onClick={fetchConcerts}>Fetch Concerts</button>

      {/* Display error messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Dropdown menus for filtering */}
      <div>
        <label>
          Venue:
          <Select
            isMulti
            options={filteredVenues.map(venue => ({ value: venue, label: venue }))}
            value={selectedVenue}
            onChange={setSelectedVenue}
          />
        </label>
        <label>
          Date:
          <Select
            isMulti
            options={filteredDates.map(date => ({ value: date, label: date }))}
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </label>
        <label>
          Artist:
          <Select
            isMulti
            options={filteredArtists.map(artist => ({ value: artist, label: artist }))}
            value={selectedArtist}
            onChange={setSelectedArtist}
          />
        </label>
      </div>

      {/* Display concert list */}
      <ul>
        {filteredConcerts.map((concert, index) => (
          <li key={index}>
            <strong>{concert.artist.name}</strong> - {concert.eventDate} <br />
            {concert.venue.name}, {concert.venue.city.name}
            <button onClick={() => searchYouTube(concert)}>Search YouTube</button>
            {youtubeLinks[concert.eventDate] && (
              <p>
                {Array.isArray(youtubeLinks[concert.eventDate]) ? (
                  youtubeLinks[concert.eventDate].map((link, idx) => (
                    <a key={idx} href={link} target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
                  ))
                ) : (
                  <span>{youtubeLinks[concert.eventDate]}</span>
                )}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
