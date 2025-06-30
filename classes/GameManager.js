import Player from "./Player.js";
import Riddle from "./Riddle.js";
import AllRiddles from "../riddles/index.js";
import readline from "readline-sync";

export default class GameManager {
  constructor() {
    // The player object will be initialized when the game starts
    this.player = null;
  }

  // Initialize the player with a name
  initPlayer() {
    const playerName = readline.question("What is your name? ");
    this.player = new Player(playerName);
    return playerName;
  }

  start() {
    // Greet the user and ask for their name
    console.log("Welcome to the Riddle Game!");
    const playerName = this.initPlayer();
    console.log(`Hello, ${playerName}! Let's start...\n`);

    // Loop through all riddles
    for (let i = 0; i < AllRiddles.length; i++) {
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
