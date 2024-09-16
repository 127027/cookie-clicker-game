const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./cookie-clicker.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Fehler beim Öffnen der Datenbank:', err.message);
  } else {
    console.log('Verbindung zur Datenbank erfolgreich hergestellt.');
  }
});

const resetPlayerStats = (playerId) => {
  db.serialize(() => {
    db.run("BEGIN TRANSACTION;");
    
    db.run("UPDATE player_stats SET cookies = 0, clicks = 0 WHERE player_id = ?", [playerId], function(err) {
      if (err) {
        console.error('Fehler beim Zurücksetzen der Spielerstatistiken:', err.message);
        db.run("ROLLBACK;");
      } else {
        console.log(`Spielerstatistiken für ${playerId} wurden zurückgesetzt.`);

        db.all("SELECT COUNT(*) AS player_count, SUM(cookies) AS total_cookies FROM player_stats", (err, stats) => {
          if (err) {
            console.error('Fehler beim Abrufen der Statistiken:', err.message);
            db.run("ROLLBACK;");
          } else {
            db.run("UPDATE global_stats SET total_cookies = ?, player_count = ?", [stats[0].total_cookies, stats[0].player_count], function(err) {
              if (err) {
                console.error('Fehler beim Aktualisieren der globalen Statistiken:', err.message);
                db.run("ROLLBACK;");
              } else {
                console.log('Globale Statistiken wurden aktualisiert.');
                db.run("COMMIT;");
              }
            });
          }
        });
      }
    });
  });
};
