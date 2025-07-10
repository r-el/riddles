# Riddles Project (Client)

Simple Node.js project for managing and playing riddle games.

## Project Structure
- `app.js`: Main entry point for app.
- `classes/`:Classes for game, players, riddles, and database.
  - `DatabaseManager.js`: Handles data storage
  - `GameManager.js`: Manages game logic.
  - `Player.js`: Player class.
  - `Riddle.js`: Riddle class.
- `data/riddles.json`: db for riddles
- `data/players.json`: db for players (Will be created automatically)

## Quick Start
1. Install dependencies: `npm install`
2. Run the app: `node app.js`

## Description
- Multiple players can play the game (not simultaneously).

- Players can see how long it took them to solve the riddles

- Player and riddles data is saved (in Json/txt file) even after restarting the game
