import React, { useState } from "react";
import Select from "react-select";
import './index.css';

function Home() {
  const API_URL = process.env.REACT_APP_API_URL || 'https://setlistcomp-038fdfda1f06.herokuapp.com';
  console.log('API_URL:', API_URL); // Debug log

  const [username, setUsername] = useState("");  
  const [concerts, setConcerts] = useState([]);  
  const [error, setError] = useState("");        
  const [selectedVenue, setSelectedVenue] = useState([]);  
  const [selectedDate, setSelectedDate] = useState([]);    
  const [selectedArtist, setSelectedArtist] = useState([]); 
  const [youtubeLinks, setYoutubeLinks] = useState({});    
  const [loading, setLoading] = useState(false);  
  const [revealedConcert, setRevealedConcert] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [allConcerts, setAllConcerts] = useState([]); // Store all concerts
  const [displayedConcerts, setDisplayedConcerts] = useState([]); // Store displayed concerts
  const [displayCount, setDisplayCount] = useState(20); // Number of concerts to display

  const fetchConcerts = () => {
    if (!username) {
      setError("Enter your Setlist.fm username!");  
      return;
    }

    setLoading(true);  
    console.log('Fetching from:', `${API_URL}/api/concerts?username=${username}&max_pages=5`);
    fetch(`${API_URL}/api/concerts?username=${username}&max_pages=5`)
      .then(response => response.json())
      .then(data => {
        setLoading(false);  
        if (data.error) {
          setError(data.error);  
          setAllConcerts([]);
          setDisplayedConcerts([]);
        } else {
          setAllConcerts(data.concerts); // Store all concerts
          setDisplayedConcerts(data.concerts.slice(0, displayCount)); // Display first 20
          setError("");                
          setShowContent(true); // Show content after fetching concerts
        }
      })
      .catch(() => {
        setLoading(false);  
        setError("Error fetching concerts.");  
      });
  };

  const searchYouTube = (concert) => {
    console.log("Concert data:", concert);
    if (!concert || !concert.artist || !concert.venue || !concert.venue.city || !concert.eventDate) {
      console.error("Invalid concert data:", concert);
      return;
    }

    const { artist, venue, eventDate } = concert;
    const city = venue.city.name;
    console.log(`Searching YouTube for: ${artist.name} at ${venue.name} in ${city} on ${eventDate}`);
    console.log('Searching YouTube at:', `${API_URL}/api/concert/videos`); // Debug log
    setLoading(true);  
    fetch(`${API_URL}/api/concert/videos?artist=${artist.name}&venue=${venue.name}&city=${city}&date=${eventDate}`)
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        setLoading(false);  
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
        setLoading(false);  
        console.error("Error fetching YouTube videos:", error);
        setYoutubeLinks(prevLinks => ({
          ...prevLinks,
          [eventDate]: 'Error fetching video'
        }));
      });
  };

  const uniqueVenues = [...new Set(concerts.map(concert => concert.venue.name))];
  const uniqueDates = [...new Set(concerts.map(concert => concert.eventDate))];
  const uniqueArtists = [...new Set(concerts.map(concert => concert.artist.name))];

  const filteredConcerts = concerts.filter(concert => {
    return (
      (selectedVenue.length === 0 || selectedVenue.some(venue => concert.venue.name === venue.value)) &&
      (selectedDate.length === 0 || selectedDate.some(date => concert.eventDate === date.value)) &&
      (selectedArtist.length === 0 || selectedArtist.some(artist => concert.artist.name === artist.value))
    );
  });

  const filteredVenues = uniqueVenues.filter(venue => {
    return (
      (selectedDate.length === 0 || concerts.some(concert => concert.venue.name === venue && selectedDate.some(date => concert.eventDate === date.value))) &&
      (selectedArtist.length === 0 || concerts.some(concert => concert.venue.name === venue && selectedArtist.some(artist => concert.artist.name === artist.value)))
    );
  });

  const filteredDates = uniqueDates.filter(date => {
    return (
      (selectedVenue.length === 0 || concerts.some(concert => concert.eventDate === date && selectedVenue.some(venue => concert.venue.name === venue.value))) &&
      (selectedArtist.length === 0 || concerts.some(concert => concert.eventDate === date && selectedArtist.some(artist => concert.artist.name === artist.value)))
    );
  });

  const filteredArtists = uniqueArtists.filter(artist => {
    return (
      (selectedVenue.length === 0 || concerts.some(concert => concert.artist.name === artist && selectedVenue.some(venue => concert.venue.name === venue.value))) &&
      (selectedDate.length === 0 || concerts.some(concert => concert.artist.name === artist && selectedDate.some(date => concert.eventDate === date.value)))
    );
  });

  // Function to load more concerts
  const loadMore = () => {
    const nextBatch = allConcerts.slice(displayedConcerts.length, displayedConcerts.length + 20);
    setDisplayedConcerts([...displayedConcerts, ...nextBatch]);
  };

  // Modify your filter logic to use allConcerts for dropdowns
  const filteredVenues = [...new Set(allConcerts.map(concert => concert.venue.name))];
  const filteredDates = [...new Set(allConcerts.map(concert => concert.eventDate))];
  const filteredArtists = [...new Set(allConcerts.map(concert => concert.artist.name))];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className={`text-center transition-transform duration-500 ${showContent ? 'transform -translate-y-16' : ''}`}>
        <h1 className="text-4xl font-bold mb-4">I Was There</h1>
        <input
          type="text"
          placeholder="Enter your Setlist.fm username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  
          className="border p-2 mb-4 w-64 rounded"
        />
        <button onClick={fetchConcerts} className="bg-blue-500 text-white p-2 rounded w-64">Fetch Concerts</button>
        {showContent && <p className="mt-4 text-xl">Concert videos for: {username}</p>}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-center">Loading...</p>}

      {showContent && (
        <div className="fade-in w-full max-w-2xl mt-8">
          <div className="mb-4">
            <label className="block mb-2">
              Venue:
              <Select
                isMulti
                options={filteredVenues.map(venue => ({ value: venue, label: venue }))}
                value={selectedVenue}
                onChange={setSelectedVenue}
                className="mt-1"
              />
            </label>
            <label className="block mb-2">
              Date:
              <Select
                isMulti
                options={filteredDates.map(date => ({ value: date, label: date }))}
                value={selectedDate}
                onChange={setSelectedDate}
                className="mt-1"
              />
            </label>
            <label className="block mb-2">
              Artist:
              <Select
                isMulti
                options={filteredArtists.map(artist => ({ value: artist, label: artist }))}
                value={selectedArtist}
                onChange={setSelectedArtist}
                className="mt-1"
              />
            </label>
          </div>

          <ul className="space-y-4">
            {displayedConcerts.map((concert, index) => (
              <li key={index} className="border p-4 rounded shadow-md">
                <div onClick={() => setRevealedConcert(revealedConcert === index ? null : index)} className="cursor-pointer">
                  <strong>{concert.artist.name}</strong> - {concert.eventDate} <br />
                  {concert.venue.name}, {concert.venue.city.name}
                </div>
                {revealedConcert === index && (
                  <div className="mt-2">
                    <button onClick={() => searchYouTube(concert)} className="bg-green-500 text-white p-2 rounded mt-2">Search YouTube</button>
                    {youtubeLinks[concert.eventDate] && (
                      <div className="mt-2">
                        {Array.isArray(youtubeLinks[concert.eventDate]) ? (
                          youtubeLinks[concert.eventDate].map((link, idx) => {
                            const videoId = link.split('v=')[1];
                            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                            return (
                              <iframe
                                key={idx}
                                width="560"
                                height="315"
                                src={embedUrl}
                                title={`YouTube video player ${idx}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="mt-2"
                              ></iframe>
                            );
                          })
                        ) : (
                          <span>{youtubeLinks[concert.eventDate]}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          {displayedConcerts.length < allConcerts.length && (
            <button 
              onClick={loadMore} 
              className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
            >
              Load More Concerts
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;