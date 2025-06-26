import Player from "./classes/Player.js";
import Riddle from "./classes/Ridlle.js";
import AllRiddles from "./riddles/index.js";
import readline from "readline-sync";

console.log("Welcome to the Riddle Game!");
const playerName = readline.question("What is your name? ");
const player = new Player(playerName);

console.log(`Hello, ${playerName}! Let's start...\n`);

for (let i = 0; i < AllRiddles.length; i++) {
  const riddleObj = AllRiddles[i];
  const riddle = Riddle.fromObject(riddleObj);
  console.log(`Riddle ${i + 1}: ${riddle.name}`);
  const start = new Date();
  riddle.ask();
  const end = new Date();
  player.recordTime(start, end);
  console.log("Correct!\n");
}

console.log(`Great job, ${playerName}!`);
player.showStats();
