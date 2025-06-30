// Usage:
//   import Riddle from './classes/Ridlle.js';
//   const riddle = new Riddle(1, 'Sample', 'What has keys but can’t open locks?', 'piano');
//   riddle.ask();

import { question } from "readline-sync";

/**
 * Represents a riddle with an id, name, description, and correct answer.
 * @class
 */
export default class Riddle {
  /**
   * Creates a new Riddle instance.
   * @param {number} id - The unique identifier for the riddle.
   * @param {string} name - The name or title of the riddle.
   * @param {string} taskDescription - The text describing the riddle.
   * @param {string} correctAnswer - The correct answer to the riddle.
   */
  constructor(id, name, taskDescription, correctAnswer) {
    this.id = id;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
  }

  /**
   * Displays the riddle, prompts the user for an answer, and checks if it is correct.
   * Continues to prompt until the user provides the correct answer.
   * @returns {void}
   */
  ask() {
    console.log("Your task is: \n", this.taskDescription);
    question("Your answer: ", {
      limit: (input) => input === this.correctAnswer,
      limitMessage: "Incorrect. Try again!",
    });
  }

  /**
   * Creates a Riddle instance from a plain object.
   * @param {Object} obj - The object containing riddle properties.
   * @param {number} obj.id - The unique identifier for the riddle.
   * @param {string} obj.name - The name or title of the riddle.
   * @param {string} obj.taskDescription - The text describing the riddle.
   * @param {string} obj.correctAnswer - The correct answer to the riddle.
   * @returns {Riddle} A new Riddle instance.
   */
  static fromObject = (obj) =>
    new Riddle(obj.id, obj.name, obj.taskDescription, obj.correctAnswer);
}
