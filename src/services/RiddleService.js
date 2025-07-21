import { RiddlesAPI } from "../api/riddlesApi.js";
import { Riddle } from "../models/Riddle.js";

/**
 * Service for riddle-related business logic
 */
export class RiddleService {
  /**
   * Get all riddles with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<Array<Riddle>>} Array of riddle objects
   */
  async getAllRiddles(options = {}) {
    try {
      const response = await RiddlesAPI.getAll(options);
      return {
        count: response.count || 0,
        riddles: Riddle.fromApiResponseArray(response.data || []),
      };
    } catch (error) {
      console.error("Error fetching all riddles:", error);
      throw error;
    }
  }

  /**
   * Get a random riddle
   * @returns {Promise<Riddle>} A random riddle
   */
  async getRandomRiddle() {
    try {
      const response = await RiddlesAPI.getRandom();
      return Riddle.fromApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching random riddle:", error);
      throw error;
    }
  }
}
