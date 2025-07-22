import { RiddleService } from '../services/RiddleService.js';
import { PlayerService } from '../services/PlayerService.js';

/**
 * ApiFacade provides a unified interface for all API services.
 * Implements the Facade design pattern.
 */
export class ApiFacade {
  constructor() {
    this.riddleService = new RiddleService();
    this.playerService = new PlayerService();
  }
  
  // RIDDLE OPERATIONS
  
  /**
   * Get all riddles with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} Array of riddle objects
   */
  async getAllRiddles(options = {}) {
    const { riddles } = await this.riddleService.getAllRiddles(options);
    return riddles;
  }
  
  /**
   * Get a random riddle
   * @returns {Promise<Object>} A random riddle
   */
  async getRandomRiddle() {
    return await this.riddleService.getRandomRiddle();
  }
  
  /**
   * Get a riddle by ID
   * @param {string} id - Riddle ID
   * @returns {Promise<Object>} Riddle object
   */
  async getRiddleById(id) {
    return await this.riddleService.getRiddleById(id);
  }
  
  /**
   * Create a new riddle
   * @param {Object} riddleData - Riddle to create
   * @returns {Promise<Object>} Created riddle
   */
  async createRiddle(riddleData) {
    return await this.riddleService.createRiddle(riddleData);
  }
  
  /**
   * Update an existing riddle
   * @param {string} id - Riddle ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated riddle
   */
  async updateRiddle(id, updates) {
    return await this.riddleService.updateRiddle(id, updates);
  }
  
  /**
   * Delete a riddle
   * @param {string} id - Riddle ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteRiddle(id) {
    return await this.riddleService.deleteRiddle(id);
  }
  
  /**
   * Check if a player's answer is correct
   * @param {string} riddleId - Riddle ID
   * @param {string} answer - Player's answer attempt
   * @returns {Promise<Object>} Result with correct answer and match status
   */
  async checkRiddleAnswer(riddleId, answer) {
    return await this.riddleService.checkAnswer(riddleId, answer);
  }
  
  /**
   * Load initial set of riddles
   * @param {Array} riddles - Array of riddle objects
   * @returns {Promise<Object>} Result of operation
   */
  async loadInitialRiddles(riddles) {
    return await this.riddleService.loadInitialRiddles(riddles);
  }

  /**
   * Get riddles by difficulty level
   * @param {string} level - Difficulty level
   * @param {number} limit - Maximum number of riddles
   * @returns {Promise<Array>} Filtered riddles
   */
  async getRiddlesByLevel(level, limit = 50) {
    return await this.riddleService.getRiddlesByLevel(level, limit);
  }
  
  // PLAYER OPERATIONS
  
  /**
   * Get all players (returns leaderboard data)
   * @param {number} limit - Maximum number of players to return
   * @returns {Promise<Array>} Array of player objects
   */
  async getAllPlayers(limit = 100) {
    return await this.playerService.getLeaderboard(limit);
  }
  
  /**
   * Create a new player
   * @param {Object} playerData - Player data with username
   * @returns {Promise<Object>} Created player
   */
  async createPlayer(playerData) {
    return await this.playerService.createPlayer(playerData.username);
  }
  
  /**
   * Update player information (not supported by API)
   * @param {string} id - Player ID (unused in this implementation)
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated player
   */
  async updatePlayer(id, updates) {
    // Note: The server API doesn't support direct player updates
    // This is a placeholder for API compatibility
    console.warn('Player update operation not supported by server API');
    throw new Error('Player update operation not supported by server API');
  }
  
  /**
   * Delete a player (not supported by API)
   * @param {number} id - Player ID
   * @returns {Promise<Object>} Deletion result
   */
  async deletePlayer(id) {
    // Note: The server API doesn't support player deletion
    // This is a placeholder for API compatibility
    console.warn('Player deletion not supported by server API');
    throw new Error('Player deletion not supported by server API');
  }
  
  /**
   * Find a player by username
   * @param {string} name - Player's username
   * @returns {Promise<Object|null>} Player object or null if not found
   */
  async findPlayerByName(name) {
    try {
      return await this.playerService.getPlayerDetails(name);
    } catch (error) {
      if (error.message.includes('Player not found')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Find or create a player by username
   * @param {string} username - Player's username
   * @returns {Promise<Object>} Player object
   */
  async findOrCreatePlayer(username) {
    return await this.playerService.findOrCreatePlayer(username);
  }
  
  /**
   * Submit a score for solving a riddle
   * @param {string} username - Player's username
   * @param {string} riddleId - ID of the solved riddle
   * @param {number} timeToSolve - Time taken to solve in milliseconds
   * @returns {Promise<Object>} Result of submission
   */
  async submitPlayerScore(username, riddleId, timeToSolve) {
    return await this.playerService.submitScore(username, riddleId, timeToSolve);
  }
  
  /**
   * Get the player leaderboard
   * @param {number} limit - Number of top players to retrieve
   * @returns {Promise<Array>} Leaderboard entries
   */
  async getLeaderboard(limit = 10) {
    return await this.playerService.getLeaderboard(limit);
  }

  /**
   * Get player statistics
   * @param {string} username - Player's username
   * @returns {Promise<Object>} Player statistics
   */
  async getPlayerStats(username) {
    return await this.playerService.getPlayerStats(username);
  }

  /**
   * Check if a username is available
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if available
   */
  async isUsernameAvailable(username) {
    return await this.playerService.isUsernameAvailable(username);
  }
}

// Export a singleton instance
export default new ApiFacade();
