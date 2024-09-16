# Cookie Clicker Game

## Überblick

Dieses Projekt ist ein einfaches Cookie-Clicker-Spiel, bei dem Benutzer Cookies durch Klicken generieren. Nach 25 gesammelten Cookies kann ein Upgrade erworben werden, das die Anzahl der pro Klick erhaltenen Cookies erhöht. Es gibt auch ein Leaderboard, das die Top-Spieler anzeigt, sowie globale Statistiken wie die Anzahl der Cookies, Klicks pro Sekunde und Spieleranzahl.

Das Backend des Spiels verwendet Node.js und Express und speichert die Daten in einer SQLite-Datenbank. Das Frontend ist in React implementiert.

## Features

- **Cookie Clicker Gameplay:** Benutzer können Cookies sammeln, indem sie klicken.
- **Upgrades:** Bei 25 Cookies kann der Benutzer ein Upgrade erwerben, das mehr Cookies pro Klick generiert.
- **Leaderboard:** Die Top 4 Spieler werden in einem Leaderboard angezeigt.
- **Globale Statistiken:** Es gibt globale Statistiken wie die Gesamtzahl der Cookies, Klicks pro Sekunde und Spieleranzahl.
- **Reset-Button:** Ein Benutzer kann sein Spiel zurücksetzen. Ein neuer Spieler wird dann erstellt.

## Technologie-Stack

- **Frontend:** React
- **Backend:** Node.js, Express.js
- **Datenbank:** SQLite
- **Version Control:** Git & GitHub
- **Hosting:** AWS EC2 (Linux-Instance)

## Installation

### Voraussetzungen

- Node.js (Version 16+)
- NPM
- Git
- Eine SQLite-Datenbank

### Schritte

1. **Klone das Repository:**
   ```bash
   git clone https://github.com/127027/cookie-clicker-game.git
