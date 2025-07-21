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
}

// Export a singleton instance
export default new ApiFacade();
