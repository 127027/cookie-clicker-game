import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = () => {
      fetch('http://3.79.240.200:3001/api/leaderboard')
        .then(response => response.json())
        .then(data => {
          if (data.leaderboard && Array.isArray(data.leaderboard)) {
            setLeaderboard(data.leaderboard);
          } else {
            console.error('Received data is not an array:', data);
            setLeaderboard([]);
          }
        })
        .catch(error => {
          console.error('Error fetching leaderboard:', error);
          setLeaderboard([]);
        });
    };

    const intervalId = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {leaderboard.map((player, index) => (
          <li key={index}>
            {player.playerName} - {player.cookies} Cookies
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
