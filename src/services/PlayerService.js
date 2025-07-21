import { PlayersAPI } from "../api/playersApi.js";
import { Player } from "../models/Player.js";

/**
 * Service for player-related business logic
 */
export class PlayerService {
  /**
   * Create a new player
   * @param {string} username - Player's username
   * @returns {Promise<Player>} Created player
   */
  async createPlayer(username) {
    try {
      // Validate username before creating
      const tempPlayer = new Player({ username });
      const validation = tempPlayer.validate();

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(", ")}`);
      }

      const response = await PlayersAPI.createPlayer(username);
      return Player.fromApiResponse(response.data);
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  }

  /**
   * Get a player's details and stats by username
   * @param {string} username - Player's username
   * @returns {Promise<Object>} Player details with stats
   */
  async getPlayerDetails(username) {
    try {
      if (!username || username.trim() === "") {
        throw new Error("Username is required");
      }

      const response = await PlayersAPI.getPlayerByUsername(username);
      return Player.fromDetailedResponse(response.data);
    } catch (error) {
      console.error("Error fetching player details:", error);
      throw error;
    }
  }

  /**
   * Submit a score for solving a riddle
   * @param {string} username - Player's username
   * @param {string} riddleId - ID of the solved riddle
   * @param {number} timeToSolve - Time taken to solve in milliseconds
   * @returns {Promise<Object>} Result of submission
   */
  async submitScore(username, riddleId, timeToSolve) {
    try {
      // Validate inputs
      if (!username || username.trim() === "") {
        throw new Error("Username is required");
      }
      if (!riddleId || riddleId.trim() === "") {
        throw new Error("Riddle ID is required");
      }
      if (typeof timeToSolve !== "number" || timeToSolve < 0) {
        throw new Error("Time to solve must be a positive number");
      }

      const response = await PlayersAPI.submitScore(username, riddleId, timeToSolve);
      return {
        success: response.success,
        message: response.message,
        newBest: response.data?.newBest || false,
      };
    } catch (error) {
      console.error("Error submitting score:", error);
      throw error;
    }
  }
}
