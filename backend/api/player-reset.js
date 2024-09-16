const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // UUID für Spieler-ID

// Route zum Zurücksetzen des Spiels (neuer Spieler beim Reset)
router.post('/player-reset', (req, res) => {
  console.log("Reset request received");
  const newPlayerId = uuidv4();
  console.log("New player ID:", newPlayerId);
  res.json({ playerId: newPlayerId });
});

module.exports = router;
