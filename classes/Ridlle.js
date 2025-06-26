import { question } from "readline-sync";

export default class Riddle {
  constructor(id, name, taskDescription, correctAnswer) {
    this.id = id;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
  }

  ask() {
    console.log("Your task is: \n", this.taskDescription);
    question("Your answer: ", {
      limit: (input) => input === this.correctAnswer,
      limitMessage: "Incorrect. Try again!",
    });
  }
}
