import { API_CONFIG, getApiUrl } from "./config.js";
import { networkUtils } from "../utils/networkUtils.js";

/**
 * PlayersAPI - Low level API communication for players endpoints
 * Includes network resilience with retry logic and caching
 */
export const PlayersAPI = {
  /**
   * Create a new player
   * Includes proper error handling and network retry logic
   */
  async createPlayer(username) {
    if (!username) throw new Error("Username is required");

    try {
      const response = await networkUtils.fetchWithRetry(getApiUrl("/players"), {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      // Cache the new player data
      networkUtils.cacheData(`player_${username}`, data);

      return data;
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes("409")) {
        throw new Error("Username already exists");
      }
      throw new Error(`Failed to create player: ${error.message}`);
    }
  },

  /**
   * Get player details by username
   * @param {string} username - Player's username
   * @returns {Promise<Object>} Player details and stats
   */
  async getPlayerByUsername(username) {
    if (!username) throw new Error("Username is required");

    const response = await fetch(getApiUrl(`/players/${username}`), {
      headers: API_CONFIG.HEADERS,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Player not found");
      }
      throw new Error(`Failed to get player: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Submit a player's score for solving a riddle
   * @param {string} username - Player's username
   * @param {string} riddleId - ID of the solved riddle
   * @param {number} timeToSolve - Time taken to solve in milliseconds
   * @returns {Promise<Object>} Submission result
   */
  async submitScore(username, riddleId, timeToSolve) {
    if (!username) throw new Error("Username is required");
    if (!riddleId) throw new Error("Riddle ID is required");
    if (!timeToSolve && timeToSolve !== 0) throw new Error("Time to solve is required");

    try {
      const response = await networkUtils.fetchWithRetry(getApiUrl("/players/submit-score"), {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ username, riddleId, timeToSolve }),
      });

      const data = await response.json();

      // Clear player cache since their stats changed
      networkUtils.clearCache(`player_${username}`);

      return data;
    } catch (error) {
      throw new Error(`Failed to submit score: ${error.message}`);
    }
  },

  /**
   * Get the player leaderboard
   * Uses caching to improve performance for frequently accessed data
   */
  async getLeaderboard(limit = 10) {
    const cacheKey = `leaderboard_${limit}`;

    try {
      // Try cache first
      const cached = networkUtils.getCachedData(cacheKey);

      // Check server availability
      const isServerAvailable = await networkUtils.isServerAvailable(getApiUrl("/health"));
      if (!isServerAvailable && cached) {
        console.log("Using cached leaderboard data (server unavailable)");
        return cached;
      }

      // Try server request
      const response = await networkUtils.fetchWithRetry(getApiUrl(`/players/leaderboard?limit=${limit}`), {
        headers: API_CONFIG.HEADERS,
      });

      const data = await response.json();

      // Cache with shorter TTL since leaderboard changes frequently
      networkUtils.cacheData(cacheKey, data, 1000 * 60 * 5); // 5 minutes

      return data;
    } catch (error) {
      // Fallback to cache if available
      const cached = networkUtils.getCachedData(cacheKey);
      if (cached) {
        console.log("Using cached leaderboard due to network error");
        return cached;
      }

      // Return empty leaderboard as last resort
      return [];
    }
  },
};
