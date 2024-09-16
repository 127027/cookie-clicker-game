const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('./cookie-clicker.db');

// Route für das Abrufen des Leaderboards (Top 4 Spieler)
router.get('/leaderboard', (req, res) => {
  db.all("SELECT playerName, cookies FROM player_stats ORDER BY cookies DESC LIMIT 4", (err, rows) => {
    if (err) {
      console.error('Fehler beim Abrufen des Leaderboards:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ leaderboard: rows });
  });
});

module.exports = router;
