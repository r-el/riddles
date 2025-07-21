/**
 * Riddle model representing a single riddle
 */
export class Riddle {
  /**
   * Create a new Riddle instance
   * @param {Object} data - Riddle data
   * @param {string} data._id - MongoDB ObjectId
   * @param {string} data.question - The riddle question
   * @param {string} data.answer - The correct answer
   * @param {string} data.level - Difficulty level (easy, medium, hard)
   * @param {string} data.createdAt - Creation date
   */
  constructor(data = {}) {
    this.id = data._id || null;
    this.question = data.question || "";
    this.answer = data.answer || "";
    this.level = data.level || "medium";
    this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
  }

  /**
   * Convert a server response to a Riddle instance
   * @param {Object} data - Raw riddle data from API
   * @returns {Riddle} A new Riddle instance
   */
  static fromApiResponse(data) {
    if (!data) return null;
    return new Riddle(data);
  }

  /**
   * Convert an array of API responses to Riddle instances
   * @param {Array} items - Array of raw riddle data
   * @returns {Array<Riddle>} Array of Riddle instances
   */
  static fromApiResponseArray(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => Riddle.fromApiResponse(item));
  }
}
