import Player from "./classes/Player.js";
import Riddle from "./classes/Ridlle.js";
import AllRiddles from "./riddles/index.js";

// Test riddle
let r1 = Riddle.fromObject(AllRiddles[0]);
r1.ask();

let p = new Player("Ariel", [4000, 5000, 6000]); // זמנים במילישניות
console.log(p);
p.showStats();
