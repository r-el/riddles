import RiddlesApiService from '../services/RiddlesApiService.js';
import PlayersApiService from '../services/PlayersApiService.js';

// Facade pattern: ApiFacade provides a unified interface to all API services (riddles, players, ...)

/**
 * ApiFacade class to handle external API calls for riddles and players.
 * Uses RiddlesApiService and PlayersApiService.
 */
export default class ApiFacade {
  // Riddle CRUD
  async getAllRiddles() {
    return await RiddlesApiService.getAllRiddles();
  }
  async getRiddleById(id) {
    return await RiddlesApiService.getRiddleById(id);
  }
  async createRiddle(riddleData) {
    return await RiddlesApiService.addRiddle(riddleData);
  }
  async updateRiddle(id, updates) {
    // updates should include id and the updated fields
    return await RiddlesApiService.updateRiddle({ id, ...updates });
  }
  async deleteRiddle(id) {
    return await RiddlesApiService.deleteRiddle(id);
  }

  // Player CRUD
  async getAllPlayers() {
    return await PlayersApiService.getAllPlayers();
  }
  async createPlayer(playerData) {
    return await PlayersApiService.addPlayer(playerData);
  }
  async updatePlayer(id, updates) {
    return await PlayersApiService.updatePlayer({ id, ...updates });
  }
  async deletePlayer(id) {
    return await PlayersApiService.deletePlayer(id);
  }
  async findPlayerByName(name) {
    const players = await this.getAllPlayers();
    return players.find(p => p.name.toLowerCase() === name.toLowerCase());
  }
}
