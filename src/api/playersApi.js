import { API_CONFIG, getApiUrl } from './config.js';

/**
 * PlayersAPI - Low level API communication for players endpoints
 */
export const PlayersAPI = {
  /**
   * Create a new player
   * @param {string} username - Player's username
   * @returns {Promise<Object>} Created player data
   */
  async createPlayer(username) {
    if (!username) throw new Error('Username is required');
    
    const response = await fetch(getApiUrl('/players'), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Username already exists');
      }
      throw new Error(`Failed to create player: ${response.status}`);
    }
    
    return response.json();
  },
};
