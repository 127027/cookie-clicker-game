import React, { useEffect, useState } from 'react';

function GlobalStats() {
  const [globalStats, setGlobalStats] = useState({
    total_cookies: 0,
    clicks_per_second: 0,
    player_count: 0,
  });

  useEffect(() => {
    const fetchStats = () => {
      fetch('http://3.79.240.200:3001/api/global-stats')
        .then(response => response.json())
        .then(data => {
          if (data.globalStats) {
            setGlobalStats(data.globalStats);
          } else {
            console.error('Error: globalStats is undefined in response', data);
            setGlobalStats({ total_cookies: 0, clicks_per_second: 0, player_count: 0 });
          }
        })
        .catch(error => {
          console.error('Error fetching global stats:', error);
          setGlobalStats({ total_cookies: 0, clicks_per_second: 0, player_count: 0 });
        });
    };

    const intervalId = setInterval(fetchStats, 1000); // Intervall auf 1 Sekunde reduzieren
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Global Statistics</h1>
      <p>Total Cookies: {globalStats.total_cookies}</p>
      <p>Klicks pro Sekunde: {globalStats.clicks_per_second}</p> {/* Klicks pro Sekunde anzeigen */}
      <p>Player Count: {globalStats.player_count}</p>
    </div>
  );
}

export default GlobalStats;
