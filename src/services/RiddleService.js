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

  /**
   * Get a riddle by ID
   * @param {string} id - Riddle ID
   * @returns {Promise<Riddle>} Riddle object
   */
  async getRiddleById(id) {
    try {
      const response = await RiddlesAPI.getById(id);
      return Riddle.fromApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching riddle by ID:", error);
      throw error;
    }
  }

  /**
   * Create a new riddle
   * @param {Riddle|Object} riddle - Riddle to create
   * @returns {Promise<Riddle>} Created riddle
   */
  async createRiddle(riddle) {
    try {
      // Validate riddle before creating
      const riddleToCreate = riddle instanceof Riddle ? riddle : new Riddle(riddle);
      const validation = riddleToCreate.validate();

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(", ")}`);
      }

      const riddleData = riddleToCreate.toApiSubmission();
      const response = await RiddlesAPI.create(riddleData);
      return Riddle.fromApiResponse(response.data);
    } catch (error) {
      console.error("Error creating riddle:", error);
      throw error;
    }
  }

  /**
   * Update an existing riddle
   * @param {string} id - Riddle ID
   * @param {Riddle|Object} updates - Fields to update
   * @returns {Promise<Riddle>} Updated riddle
   */
  async updateRiddle(id, updates) {
    try {
      // If updates is a Riddle instance, validate it
      if (updates instanceof Riddle) {
        const validation = updates.validate();
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${Object.values(validation.errors).join(", ")}`);
        }
      }

      const updateData = updates instanceof Riddle ? updates.toApiSubmission() : updates;

      const response = await RiddlesAPI.update(id, updateData);
      return Riddle.fromApiResponse(response.data);
    } catch (error) {
      console.error("Error updating riddle:", error);
      throw error;
    }
  }

  /**
   * Delete a riddle
   * @param {string} id - Riddle ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteRiddle(id) {
    try {
      const response = await RiddlesAPI.delete(id);
      return {
        success: response.success,
        deletedId: response.data?.id || id,
      };
    } catch (error) {
      console.error("Error deleting riddle:", error);
      throw error;
    }
  }

  /**
   * Check if a player's answer is correct
   * @param {string} riddleId - Riddle ID
   * @param {string} answer - Player's answer attempt
   * @returns {Promise<Object>} Result with correct answer and match status
   */
  async checkAnswer(riddleId, answer) {
    try {
      const riddle = await this.getRiddleById(riddleId);
      const isCorrect = riddle.isCorrectAnswer(answer);

      return {
        isCorrect,
        correctAnswer: riddle.answer,
        providedAnswer: answer,
        riddleId: riddle.id,
      };
    } catch (error) {
      console.error("Error checking answer:", error);
      throw error;
    }
  }
}
