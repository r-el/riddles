import { RiddleService } from "../services/RiddleService.js";
import { PlayerService } from "../services/PlayerService.js";
import readline from "readline-sync";

class GameManager {
  constructor() {
    this.player = null;
    this.riddleService = new RiddleService();
    this.playerService = new PlayerService();
  }

  // #region Main Menu
  // Main menu with multiple options
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

      try {
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
      } catch (error) {
        console.log("Error: " + (error.message || "Unknown error occurred"));
      }
    }
  }
  // #endregion Main Menu

  // #region Game Flow
  // Play the riddle game flow
  async playGame() {
    try {
      const player = await this._getOrCreatePlayer();
      this.player = player;
      this._showPlayerBestTime(player);

      const riddlesResponse = await this.riddleService.getAllRiddles();
      const riddles = riddlesResponse.riddles;

      if (!riddles || !riddles.length) {
        console.log("No riddles found. Add riddles first!");
        return;
      }

      const totalTime = await this._askAllRiddles(riddles);
      if (totalTime !== null) {
        await this._updatePlayerBestTime(player, totalTime);
      }
    } catch (error) {
      console.log("Error: " + (error.message || "Unknown error"));
    }
  }
  // #endregion Game Flow

  // #region Player Helpers
  // Get or create a player
  async _getOrCreatePlayer() {
    const playerName = readline.question("What is your name? ");

    try {
      return await this.playerService.findOrCreatePlayer(playerName);
    } catch (error) {
      console.log("Could not find or create player: " + error.message);
      throw error;
    }
  }

  // Show best time for player
  _showPlayerBestTime(player) {
    try {
      if (player.bestTime) {
        console.log("Hi " + player.username + "! Your best time was " + player.bestTime / 1000 + " seconds.");
      } else {
        console.log("Hi " + player.username + "! No previous time recorded.");
      }
    } catch (error) {
      console.log("Could not show best time: " + error.message);
    }
  }
  // #endregion Player Helpers

  // #region Riddle Gameplay
  // Ask the player all riddles and record total time
  async _askAllRiddles(riddles) {
    let totalTime = 0;

    for (let i = 0; i < riddles.length; i++) {
      const riddle = riddles[i];
      console.log("Riddle " + (i + 1) + ": " + riddle.question);

      const start = new Date();
      let isCorrect = false;

      while (!isCorrect) {
        const answer = readline.question("Your answer: ");
        isCorrect = riddle.isCorrectAnswer(answer);

        if (isCorrect) {
          console.log("Correct!\n");
        } else {
          console.log("Wrong! The correct answer was: " + riddle.answer + "\n");
          break;
        }
      }

      const end = new Date();
      const time = end - start;
      totalTime += time;

      try {
        if (isCorrect && this.player) {
          await this.playerService.submitScore(this.player.username, riddle.id, time);
        }
      } catch (error) {
        console.log("Error submitting score: " + error.message);
      }
    }

    console.log("Great job! Your time: " + Math.round(totalTime / 1000) + " seconds");
    return totalTime;
  }

  // Update player's best time if new time is better
  async _updatePlayerBestTime(player, totalTime) {
    try {
      const updatedPlayer = await this.playerService.getPlayerDetails(player.username);

      if (!player.bestTime || totalTime < player.bestTime) {
        console.log("New record! Time updated.");
      } else {
        console.log("Your best time remains: " + Math.round(player.bestTime / 1000) + " seconds");
      }
    } catch (error) {
      console.log("Could not update best time: " + error.message);
    }
  }
  // #endregion Riddle Gameplay

  // #region Riddle CRUD
  // Create a new riddle
  async createRiddle() {
    const question = readline.question("Enter riddle question: ");
    const answer = readline.question("Enter correct answer: ");
    const level = readline.question("Enter level (easy/medium/hard): ");

    try {
      await this.riddleService.createRiddle({ question, answer, level });
      console.log("Riddle created successfully!");
    } catch (error) {
      console.log("Error creating riddle: " + error.message);
    }
  }

  // Show all riddles
  async readAllRiddles() {
    try {
      const response = await this.riddleService.getAllRiddles();
      const riddles = response.riddles;

      if (!riddles.length) {
        console.log("No riddles found.");
        return;
      }

      riddles.forEach((r, i) => {
        console.log(
          "ID: " + r.id + " | Question: " + r.question + " | Answer: " + r.answer + " | Level: " + r.level
        );
      });
    } catch (error) {
      console.log("Error reading riddles: " + error.message);
    }
  }

  // Update a riddle
  async updateRiddle() {
    try {
      const response = await this.riddleService.getAllRiddles();
      const riddles = response.riddles;

      if (!riddles.length) {
        console.log("No riddles found.");
        return;
      }

      riddles.forEach((r, i) => {
        console.log(i + 1 + ". " + r.question);
      });

      const index = readline.questionInt("Enter riddle number to update: ") - 1;

      if (index < 0 || index >= riddles.length) {
        console.log("Invalid riddle number.");
        return;
      }

      const riddle = riddles[index];
      const question = readline.question("Enter new question [" + riddle.question + "]: ") || riddle.question;
      const answer = readline.question("Enter new answer [" + riddle.answer + "]: ") || riddle.answer;
      const level = readline.question("Enter new level [" + riddle.level + "]: ") || riddle.level;

      await this.riddleService.updateRiddle(riddle.id, { question, answer, level });
      console.log("Riddle updated successfully!");
    } catch (error) {
      console.log("Error updating riddle: " + error.message);
    }
  }

  // Delete a riddle
  async deleteRiddle() {
    try {
      const response = await this.riddleService.getAllRiddles();
      const riddles = response.riddles;

      if (!riddles.length) {
        console.log("No riddles found.");
        return;
      }

      riddles.forEach((r, i) => {
        console.log(i + 1 + ". " + r.question);
      });

      const index = readline.questionInt("Enter riddle number to delete: ") - 1;

      if (index < 0 || index >= riddles.length) {
        console.log("Invalid riddle number.");
        return;
      }

      const riddle = riddles[index];
      const confirm = readline.question('Are you sure you want to delete "' + riddle.question + '"? (y/n): ');

      if (confirm.toLowerCase() === "y") {
        await this.riddleService.deleteRiddle(riddle.id);
        console.log("Riddle deleted successfully!");
      } else {
        console.log("Delete cancelled.");
      }
    } catch (error) {
      console.log("Error deleting riddle: " + error.message);
    }
  }
  // #endregion Riddle CRUD

  // #region Leaderboard
  // Show the top 10 players with best times
  async showLeaderboard() {
    try {
      const leaderboard = await this.playerService.getLeaderboard(10);

      if (!leaderboard.length) {
        console.log("No players found with recorded times.");
        return;
      }

      console.log("\nLeaderboard (Top 10):");
      leaderboard.forEach((player, i) => {
        console.log(
          i +
            1 +
            ". " +
            player.username +
            " - " +
            player.formattedTime +
            " (solved " +
            player.riddlesSolved +
            " riddles)"
        );
      });
    } catch (error) {
      console.log("Error fetching leaderboard: " + error.message);
    }
  }
  // #endregion Leaderboard
}

export default GameManager;
