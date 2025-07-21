/**
 * Player model representing a game player
 */
export class Player {
  /**
   * Create a new Player instance
   * @param {Object} data - Player data
   * @param {number} data.id - Player ID
   * @param {string} data.username - Player's username
   * @param {number} data.best_time - Player's best solving time
   * @param {string} data.created_at - Account creation date
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.username = data.username || "";
    this.bestTime = data.best_time || 0;
    this.createdAt = data.created_at ? new Date(data.created_at) : null;
  }

  /**
   * Convert a server response to a Player instance
   * @param {Object} data - Raw player data from API
   * @returns {Player} A new Player instance
   */
  static fromApiResponse(data) {
    if (!data) return null;
    return new Player(data);
  }

  /**
   * Create a player from the detailed player response
   * @param {Object} response - API response with player, stats, and history
   * @returns {Object} Player with enhanced properties
   */
  static fromDetailedResponse(response) {
    if (!response || !response.player) return null;

    const player = new Player(response.player);

    // Add stats
    player.stats = response.stats || {
      total_solved: 0,
      avg_time: 0,
      best_time: 0,
    };

    // Add history
    player.history = response.history || [];

    return player;
  }

  /**
   * Convert an array of API responses to Player instances
   * @param {Array} items - Array of raw player data
   * @returns {Array<Player>} Array of Player instances
   */
  static fromApiResponseArray(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => Player.fromApiResponse(item));
  }

  /**
   * Convert to a plain object for API submission
   * @returns {Object} Plain object representation
   */
  toApiSubmission() {
    return {
      username: this.username,
    };
  }

  /**
   * Format the player's best time for display
   * @returns {string} Formatted time string
   */
  getFormattedBestTime() {
    if (!this.bestTime || this.bestTime === 0) return "No time recorded";

    const seconds = Math.floor((this.bestTime / 1000) % 60);
    const minutes = Math.floor((this.bestTime / (1000 * 60)) % 60);

    if (minutes === 0) {
      return `${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  }

}
