import Player from "./Player.js";
import Riddle from "./Riddle.js";
import DatabaseManager from "./DatabaseManager.js";
import readline from "readline-sync";

export default class GameManager {
  constructor() {
    this.player = null;
    this.db = new DatabaseManager();
  }

  // #region Game Flow
  /*
   * Main game logic
   * handles player, riddles, and timing
   */
  async playGame() {
    const player = await this._getOrCreatePlayer();
    this._showPlayerBestTime(player);
    const riddles = await this.db.getAllRiddles();
    if (!riddles.length) {
      console.log("No riddles found. Add riddles first!");
      return;
    }
    const totalTime = await this._askAllRiddles(riddles);
    await this._updatePlayerBestTime(player, totalTime);
  }
  // #endregion Game Flow

  // #region Player Helpers
  // Get or create player
  async _getOrCreatePlayer() {
    const playerName = readline.question("What is your name? ");
    let player = await this.db.findPlayerByName(playerName);
    if (player) {
      return player;
    } else {
      const newPlayer = await this.db.createPlayer({ name: playerName });
      console.log(`Welcome, ${playerName}! Good luck!`);
      return { ...newPlayer, lowestTime: null };
    }
  }

  // Show player's best time
  _showPlayerBestTime(player) {
    if (player.lowestTime) {
      console.log(`Hi ${player.name}! Your previous lowest time was ${player.lowestTime / 1000} seconds.`);
    } else {
      console.log(`Hi ${player.name}! No previous time recorded.`);
    }
  }
  // #endregion Player Helpers

  // #region Riddle Helpers
  // Ask all riddles and return total time
  async _askAllRiddles(riddles) {
    let totalTime = 0;
    for (let i = 0; i < riddles.length; i++) {
      const riddle = Riddle.fromObject(riddles[i]);
      console.log(`Riddle ${i + 1}: ${riddle.name}`);
      const start = new Date();
      riddle.ask();
      const end = new Date();
      totalTime += end - start;
      console.log("Correct!\n");
    }
    console.log(`Great job! Your time: ${Math.round(totalTime / 1000)} seconds`);
    return totalTime;
  }

  // Update player's best time if needed
  async _updatePlayerBestTime(player, totalTime) {
    if (!player.lowestTime || totalTime < player.lowestTime) {
      await this.db.updatePlayer(player.id, { lowestTime: totalTime });
      console.log("New record! Time updated.");
    } else {
      console.log(`Your best time remains: ${Math.round(player.lowestTime / 1000)} seconds`);
    }
  }
  // #endregion Riddle Helpers

  // #region Main Menu
  // Main menu for the game
  async showMainMenu() {
    while (true) {
      console.log("\nWhat do you want to do?");
      console.log("1. Play the game");
      console.log("2. Create a new riddle");
      console.log("3. Read all riddles");
      console.log("4. Update an existing riddle");
      console.log("5. Delete a riddle");
      console.log("6. View leaderboard");
      console.log("7. Exit");
      const choice = readline.question("Enter your choice: ");
      switch (choice) {
        case "1":
          await this.playGame();
          break;
        case "2":
          await this.createRiddle();
          break;
        case "3":
          await this.readAllRiddles();
          break;
        case "4":
          await this.updateRiddle();
          break;
        case "5":
          await this.deleteRiddle();
          break;
        case "6":
          await this.showLeaderboard();
          break;
        case "7":
          console.log("Goodbye!");
          return;
        default:
          console.log("Invalid choice. Try again.");
      }
    }
  }
  // #endregion Main Menu

  // #region Riddle CRUD
  // Create a new riddle and save it to database
  async createRiddle() {
    const name = readline.question("Enter riddle name: ");
    const taskDescription = readline.question("Enter description: ");
    const correctAnswer = readline.question("Enter correct answer: ");
    await this.db.createRiddle({ name, taskDescription, correctAnswer });
    console.log("Riddle created successfully!");
  }

  // Show all riddles from the database
  async readAllRiddles() {
    const riddles = await this.db.getAllRiddles();
    if (!riddles.length) {
      console.log("No riddles found.");
      return;
    }
    riddles.forEach((r, i) => {
      console.log(
        `ID: ${r.id} | Name: ${r.name} | Description: ${r.taskDescription} | Answer: ${r.correctAnswer}`
      );
    });
  }

  // Update an existing riddle by ID
  async updateRiddle() {
    const id = readline.questionInt("Enter riddle ID to update: ");
    const riddles = await this.db.getAllRiddles();
    const riddle = riddles.find((r) => r.id === id);
    if (!riddle) {
      console.log("Riddle not found.");
      return;
    }
    const name = readline.question(`Enter new name [${riddle.name}]: `) || riddle.name;
    const taskDescription =
      readline.question(`Enter new description [${riddle.taskDescription}]: `) || riddle.taskDescription;
    const correctAnswer =
      readline.question(`Enter new answer [${riddle.correctAnswer}]: `) || riddle.correctAnswer;
    await this.db.updateRiddle(id, { name, taskDescription, correctAnswer });
    console.log("Riddle updated successfully!");
  }

  // Delete a riddle by ID
  async deleteRiddle() {
    const id = readline.questionInt("Enter riddle ID to delete: ");
    const riddles = await this.db.getAllRiddles();
    const riddle = riddles.find((r) => r.id === id);
    if (!riddle) {
      console.log("Riddle not found.");
      return;
    }
    const confirm = readline.question("Are you sure you want to delete this riddle? (y/n): ");
    if (confirm.toLowerCase() === "y") {
      await this.db.deleteRiddle(id);
      console.log("Riddle deleted successfully!");
    } else {
      console.log("Delete cancelled.");
    }
  }
  // #endregion Riddle CRUD

  // #region Leaderboard
  // Show leaderboard of players with best times
  async showLeaderboard() {
    const players = await this.db.getAllPlayers();
    // Filter only players with a lowestTime value
    const filtered = players.filter((p) => p.lowestTime != null);
    if (!filtered.length) {
      console.log("No results yet. No player that completed the game.");
      return;
    }
    // Sort lowestTime by ASC
    filtered.sort((a, b) => a.lowestTime - b.lowestTime);
    console.log("\n🏆 Leaderboard (Top 10):");
    filtered.slice(0, 10).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${(p.lowestTime / 1000).toFixed(2)} seconds`);
    });
  }
  // #endregion Leaderboard
}
