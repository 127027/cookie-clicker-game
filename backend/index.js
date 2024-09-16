const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid'); // UUID für Spieler-ID
const playerResetRoute = require('./api/player-reset'); // <-- Import der Reset-Route
const leaderboardRoute = require('./api/leaderboard'); // <-- Import der Leaderboard-Route

const app = express();
const PORT = 3001;

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('./cookie-clicker.db');

// Temporäre Variable zum Zählen der Klicks (nicht Cookies)
let totalClicksInCurrentSecond = 0;

// Middleware
app.use(cors());
app.use(express.json());

// Verwende die Reset-Route und Leaderboard-Route
app.use('/api', playerResetRoute);
app.use('/api', leaderboardRoute);

// Initialisiere die Tabellen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS player_stats (
      playerId TEXT PRIMARY KEY,
      playerName TEXT NOT NULL DEFAULT 'Default Player',
      cookies INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      last_reset_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS global_stats (
      total_cookies INTEGER DEFAULT 0,
      clicks_per_second INTEGER DEFAULT 0,
      player_count INTEGER DEFAULT 0
    )
  `);
  db.run(`INSERT OR IGNORE INTO global_stats (total_cookies, clicks_per_second, player_count) VALUES (0, 0, 0)`);
});

// Route zum Aktualisieren der Spielerstatistiken
app.post('/api/player-stats', (req, res) => {
  const { playerId, playerName, cookies, clicks } = req.body;
  const newPlayerId = playerId || uuidv4(); // Wenn keine Spieler-ID vorhanden ist, generiere eine neue

  // Hier zählen wir die Klicks, nicht die Cookies
  totalClicksInCurrentSecond += 1; // Jeder Klick wird um 1 erhöht

  db.run(`
    INSERT INTO player_stats (playerId, playerName, cookies, clicks)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(playerId)
    DO UPDATE SET cookies = ?, clicks = ?`,
    [newPlayerId, playerName, cookies, clicks, cookies, clicks],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Aktualisiere globale Statistiken
      db.get(`SELECT SUM(cookies) as total_cookies, COUNT(playerId) as player_count FROM player_stats`, (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const total_cookies = row.total_cookies || 0;
        const player_count = row.player_count || 0;

        db.run(`UPDATE global_stats SET total_cookies = ?, player_count = ?`, [total_cookies, player_count], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Player stats updated", playerId: newPlayerId });
        });
      });
    }
  );
});

// Route für das Abrufen der globalen Statistiken
app.get('/api/global-stats', (req, res) => {
  db.get("SELECT SUM(cookies) as total_cookies, COUNT(playerId) as player_count FROM player_stats", (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total_cookies = row.total_cookies || 0;
    const player_count = row.player_count || 0;

    db.get("SELECT clicks_per_second FROM global_stats", (err, stats) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const clicks_per_second = stats ? stats.clicks_per_second : 0;

      res.json({ globalStats: { total_cookies, player_count, clicks_per_second } });

      // Zurücksetzen der Klicks für den nächsten 1-Sekunden-Intervall
      db.run("UPDATE global_stats SET clicks_per_second = ?", [totalClicksInCurrentSecond], function(err) {
        if (err) {
          console.error("Fehler beim Aktualisieren der Klicks pro Sekunde:", err.message);
        }
      });

      // Zurücksetzen der Klicks für die nächste Sekunde
      totalClicksInCurrentSecond = 0;
    });
  });
});

// Starte den Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// Alle 1 Sekunde Klicks pro Sekunde berechnen
setInterval(() => {
  // Die Klicks werden in jeder Sekunde in der Datenbank aktualisiert
  db.run("UPDATE global_stats SET clicks_per_second = ?", [totalClicksInCurrentSecond], function(err) {
    if (err) {
      console.error("Fehler beim Aktualisieren der Klicks pro Sekunde:", err.message);
    }
    // Zurücksetzen der Klicks für die nächste Sekunde
    totalClicksInCurrentSecond = 0;
  });
}, 1000); // Jede Sekunde
