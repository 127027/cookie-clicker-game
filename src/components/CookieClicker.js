import React, { useState, useEffect } from 'react';

function CookieClicker() {
  const [cookies, setCookies] = useState(() => {
    const savedCookies = localStorage.getItem('cookies');
    return savedCookies ? parseInt(savedCookies, 10) : 0;
  });

  const [cookiesPerClick, setCookiesPerClick] = useState(() => {
    const savedRate = localStorage.getItem('cookiesPerClick');
    return savedRate ? parseInt(savedRate, 10) : 1;
  });

  const [playerName, setPlayerName] = useState(() => {
    const savedName = localStorage.getItem('playerName');
    return savedName || '';
  });

  const [playerId, setPlayerId] = useState(() => {
    const savedId = localStorage.getItem('playerId');
    return savedId || null;
  });

  const [isNewPlayer, setIsNewPlayer] = useState(!playerName);

  const updateStats = (updatedCookies, updatedClicks) => {
    fetch('http://3.79.240.200:3001/api/player-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: playerId,
        playerName: playerName,
        cookies: updatedCookies,
        clicks: updatedClicks,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setPlayerId(data.playerId);
        localStorage.setItem('playerId', data.playerId);
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    localStorage.setItem('cookies', cookies);
    localStorage.setItem('cookiesPerClick', cookiesPerClick);
    if (!isNewPlayer) {
      localStorage.setItem('playerName', playerName);
    }
  }, [cookies, cookiesPerClick, playerName, isNewPlayer]);

  const handleCookieClick = () => {
    const newCookies = cookies + cookiesPerClick;
    const newTotalClicks = newCookies;
    setCookies(newCookies);
    updateStats(newCookies, newTotalClicks);
  };

  const handleUpgrade = () => {
    if (cookies >= 25) {
      const newCookies = cookies - 25;
      const newCookiesPerClick = cookiesPerClick + 1;
      setCookies(newCookies);
      setCookiesPerClick(newCookiesPerClick);
      updateStats(newCookies, newCookiesPerClick);
    }
  };

  const handleReset = () => {
    setCookies(0);
    setCookiesPerClick(1);
    setPlayerId(null);
    setPlayerName('');
    setIsNewPlayer(true);
    localStorage.removeItem('cookies');
    localStorage.removeItem('cookiesPerClick');
    localStorage.removeItem('playerId');
    localStorage.removeItem('playerName');

    fetch('http://3.79.240.200:3001/api/player-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        setPlayerId(data.playerId);
      })
      .catch(error => console.error('Error bei Reset:', error));
  };

  return (
    <div>
      <h1>Cookie Clicker</h1>
      {isNewPlayer && (
        <div>
          <input
            type="text"
            placeholder="Enter your name..."
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
          />
          <button onClick={() => {
            if (playerName.trim() !== '') {
              localStorage.setItem('playerName', playerName);
              setIsNewPlayer(false);
            }
          }}>
            Set Name
          </button>
        </div>
      )}
      {!isNewPlayer && (
        <>
          <button onClick={handleCookieClick}>Cookie</button>
          <p>Cookies: {cookies}</p>
          <p>Cookies per Click: {cookiesPerClick}</p>
          {playerName && <p>Spieler: {playerName}</p>}
          <button onClick={handleUpgrade} disabled={cookies < 25}>
            Upgrade for 25 Cookies
          </button>
        </>
      )}
      <button onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
}

export default CookieClicker;
