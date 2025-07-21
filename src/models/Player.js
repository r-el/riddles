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

}
