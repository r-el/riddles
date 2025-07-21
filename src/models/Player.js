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

}
