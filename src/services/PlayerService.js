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

  /**
   * Get the player leaderboard
   * @param {number} limit - Number of top players to retrieve
   * @returns {Promise<Array>} Leaderboard entries
   */
  async getLeaderboard(limit = 10) {
    try {
      if (typeof limit !== "number" || limit < 1 || limit > 100) {
        throw new Error("Limit must be a number between 1 and 100");
      }

      const response = await PlayersAPI.getLeaderboard(limit);
      return response.data.map((player) => ({
        id: player.id,
        username: player.username,
        bestTime: player.best_time,
        riddlesSolved: player.riddles_solved || 0,
        formattedTime: this._formatTime(player.best_time),
      }));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw error;
    }
  }

  /**
   * Find or create a player
   * @param {string} username - Player's username
   * @returns {Promise<Player>} Player object
   */
  async findOrCreatePlayer(username) {
    try {
      // Validate username first
      const tempPlayer = new Player({ username });
      const validation = tempPlayer.validate();

      if (!validation.isValid) {
        throw new Error(`Invalid username: ${Object.values(validation.errors).join(", ")}`);
      }

      // Try to fetch the player first
      try {
        return await this.getPlayerDetails(username);
      } catch (error) {
        // If player not found (404), create a new one
        if (error.message.includes("Player not found")) {
          return await this.createPlayer(username);
        }
        // Otherwise rethrow the error
        throw error;
      }
    } catch (error) {
      console.error("Error finding or creating player:", error);
      throw error;
    }
  }

  /**
   * Check if a username is available
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if username is available
   */
  async isUsernameAvailable(username) {
    try {
      await this.getPlayerDetails(username);
      // If we get here, the username exists
      return false;
    } catch (error) {
      if (error.message.includes("Player not found")) {
        return true;
      }
      // For other errors, rethrow
      throw error;
    }
  }

  /**
   * Get player statistics summary
   * @param {string} username - Player's username
   * @returns {Promise<Object>} Player statistics
   */
  async getPlayerStats(username) {
    try {
      const player = await this.getPlayerDetails(username);

      return {
        username: player.username,
        bestTime: player.bestTime,
        formattedBestTime: player.getFormattedBestTime(),
        createdAt: player.createdAt,
        formattedCreatedAt: player.getFormattedCreatedAt(),
        stats: player.stats || {},
        totalSolved: player.stats?.total_solved || 0,
        averageTime: player.stats?.avg_time || 0,
        historyCount: player.history?.length || 0,
      };
    } catch (error) {
      console.error("Error fetching player stats:", error);
      throw error;
    }
  }

  /**
   * Private method to format time in milliseconds
   * @param {number} timeMs - Time in milliseconds
   * @returns {string} Formatted time string
   * @private
   */
  _formatTime(timeMs) {
    if (!timeMs || timeMs === 0) return "No time recorded";

    const seconds = Math.floor((timeMs / 1000) % 60);
    const minutes = Math.floor((timeMs / (1000 * 60)) % 60);

    if (minutes === 0) return `${seconds}s`;
    

    return `${minutes}m ${seconds}s`;
  }
}
