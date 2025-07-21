import { PlayersAPI } from '../api/playersApi.js';
import { Player } from '../models/Player.js';

/**
 * Service for player-related business logic
 */
export class PlayerService {
  /**
   * Create a new player
   * @param {string} username - Player's username
   * @returns {Promise<Player>} Created player
   */
  async createPlayer(username) {
    try {
      // Validate username before creating
      const tempPlayer = new Player({ username });
      const validation = tempPlayer.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${Object.values(validation.errors).join(', ')}`);
      }

      const response = await PlayersAPI.createPlayer(username);
      return Player.fromApiResponse(response.data);
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  }
 
}
