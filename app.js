import Riddle from "./classes/Ridlle.js";
import AllRiddles from "./riddles/index.js";

// Test riddle
let r1 = Riddle.fromObject(AllRiddles[0]);
r1.ask();
