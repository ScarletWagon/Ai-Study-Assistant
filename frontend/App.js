import React, { useState } from 'react';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [clickCount, setClickCount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send request to backend to shorten URL
    const response = await fetch('http://localhost:5000/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    });

    const data = await response.json();
    setShortenedUrl(data.shortenedUrl);
  };

  const handleAnalytics = async () => {
    // Send request to backend to fetch analytics
    const response = await fetch(`http://localhost:5000/api/analytics/${shortenedUrl.split('/').pop()}`);
    const data = await response.json();
    setClickCount(data.clickCount);
  };

  return (
    <div className="App">
      <h1>URL Shortener and Analytics</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter a URL to shorten"
        />
        <button type="submit">Shorten URL</button>
      </form>

      {shortenedUrl && (
        <div>
          <p>Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a></p>
          <button onClick={handleAnalytics}>View Click Analytics</button>
        </div>
      )}

      {clickCount !== null && (
        <div>
          <p>Click Count: {clickCount}</p>
        </div>
      )}
    </div>
  );
}

export default App;
