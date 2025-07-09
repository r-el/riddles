import Player from "./Player.js";
import Riddle from "./Riddle.js";
import DatabaseManager from "./DatabaseManager.js";
import readline from "readline-sync";

export default class GameManager {
  constructor() {
    // The player object will be initialized when the game starts
    this.player = null;
    this.db = new DatabaseManager();
  }

  // The player object will be initialized when the game starts
  initPlayer() {
    const playerName = readline.question("What is your name? ");
    this.player = new Player(playerName);
    return playerName;
  }

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
          // TODO: Implement this. this.playGame();
          console.log("Game not implemented yet.");
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
          // TODO: Implement this. this.showLeaderboard();
          console.log("Leaderboard not implemented yet.");
          break;
        case "7":
          console.log("Goodbye!");
          return;
        default:
          console.log("Invalid choice. Try again.");
      }
    }
  }

  async createRiddle() {
    const name = readline.question("Enter riddle name: ");
    const taskDescription = readline.question("Enter description: ");
    const correctAnswer = readline.question("Enter correct answer: ");
    await this.db.createRiddle({ name, taskDescription, correctAnswer });
    console.log("Riddle created successfully!");
  }
      const riddleObj = AllRiddles[i];

      // Create a Riddle instance from the riddle object
      const riddle = Riddle.fromObject(riddleObj);

      console.log(`Riddle ${i + 1}: ${riddle.name}`);

      // Record the time before and after asking the riddle
      const start = new Date();
      riddle.ask();
      const end = new Date();

      // Save the time taken to answer
      this.player.recordTime(start, end);

      console.log("Correct!\n");
    }

    // Show stats
    console.log(`Great job, ${playerName}!`);
    this.player.showStats();
  }
}
