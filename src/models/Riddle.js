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

  /**
   * Convert to a plain object for API submission
   * @returns {Object} Plain object representation
   */
  toApiSubmission() {
    return {
      question: this.question,
      answer: this.answer,
      level: this.level,
    };
  }

  /**
   * Check if the provided answer is correct
   * @param {string} answer - The answer to check
   * @returns {boolean} True if the answer is correct
   */
  isCorrectAnswer(answer) {
    if (!answer || typeof answer !== "string") return false;
    return this.answer.toLowerCase().trim() === answer.toLowerCase().trim();
  }

  /**
   * Get a formatted display string for the riddle level
   * @returns {string} Formatted level string
   */
  getFormattedLevel() {
    const levels = {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    };
    return levels[this.level.toLowerCase()] || this.level;
  }

  /**
   * Validate the riddle data
   * @returns {Object} Validation result with errors
   */
  validate() {
    const errors = {};

    if (!this.question || this.question.trim() === "") {
      errors.question = "Question is required";
    }

    if (!this.answer || this.answer.trim() === "") {
      errors.answer = "Answer is required";
    }

    if (this.level && !["easy", "medium", "hard"].includes(this.level.toLowerCase())) {
      errors.level = "Level must be easy, medium, or hard";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
