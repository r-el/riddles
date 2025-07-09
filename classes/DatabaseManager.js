import JsonFileCrud from 'json-file-crud';
import path from 'path';

const riddlesPath = path.resolve('./data/riddles.text');
const playersPath = path.resolve('./data/players.text');

/**
 * DatabaseManager class to handle CRUD operations for riddles and players.
 * Uses JsonFileCrud for file-based database operations.
 */
export default class DatabaseManager {
  constructor() {
    this.riddlesDB = new JsonFileCrud(riddlesPath);
    this.playersDB = new JsonFileCrud(playersPath);
  }

  // Riddle CRUD
  getAllRiddles() {
    return this.riddlesDB.read();
  }
  createRiddle(riddleData) {
    return this.riddlesDB.create(riddleData);
  }
  updateRiddle(id, updates) {
    return this.riddlesDB.update(id, updates);
  }
  deleteRiddle(id) {
    return this.riddlesDB.delete(id);
  }

  // Player CRUD
  getAllPlayers() {
    return this.playersDB.read();
  }
  createPlayer(playerData) {
    return this.playersDB.create(playerData);
  }
  updatePlayer(id, updates) {
    return this.playersDB.update(id, updates);
  }
}
