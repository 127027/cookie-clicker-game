const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('./cookie-clicker.db');

// Route für das Abrufen der globalen Statistiken
router.get('/global-stats', (req, res) => {
  db.get("SELECT SUM(cookies) as total_cookies, COUNT(playerId) as player_count FROM player_stats", (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.get("SELECT clicks_per_5_seconds FROM global_stats", (err, stats) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const total_cookies = row.total_cookies || 0;
      const player_count = row.player_count || 0;
      const clicks_per_5_seconds = stats ? stats.clicks_per_5_seconds : 0;

      res.json({ globalStats: { total_cookies, player_count, clicks_per_5_seconds } });

      // Zurücksetzen der Klicks
      db.run("UPDATE global_stats SET clicks_per_5_seconds = 0", [], (updateErr) => {
        if (updateErr) {
          console.error("Fehler beim Zurücksetzen der Klicks:", updateErr.message);
        }
      });
    });
  });
});

module.exports = router;
