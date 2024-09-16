// App.js
import React from 'react';
import './styles/App.css';
import CookieClicker from './components/CookieClicker';
import Leaderboard from './components/Leaderboard';
import GlobalStats from './components/GlobalStats';

function App() {
  return (
    <div className="app">
      <CookieClicker />
      <Leaderboard />
      <GlobalStats />
      <div className="grafana-dashboard">
        <h2>Grafana Dashboard Platzhalter</h2>
        <p>Hier wird das Grafana-Dashboard eingebunden sein.</p>
      </div>
    </div>
  );
}

export default App;
