import JsonFileCrud from 'json-file-crud';
import path from 'path';

const riddlesPath = path.resolve('./data/riddles.json'); // Can be also a txt file
const playersPath = path.resolve('./data/players.json'); // Can be also a txt file

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
    return new Promise((resolve, reject) => {
      this.riddlesDB.readAll((err, items) => {
        if (err) reject(err);
        else resolve(items || []);
      });
    });
  }
  createRiddle(riddleData) {
    return new Promise((resolve, reject) => {
      this.riddlesDB.create(riddleData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
  updateRiddle(id, updates) {
    return new Promise((resolve, reject) => {
      this.riddlesDB.update(id, updates, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
  deleteRiddle(id) {
    return new Promise((resolve, reject) => {
      this.riddlesDB.delete(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Player CRUD
  getAllPlayers() {
    return new Promise((resolve, reject) => {
      this.playersDB.readAll((err, items) => {
        if (err) reject(err);
        else resolve(items || []);
      });
    });
  }
  createPlayer(playerData) {
    return new Promise((resolve, reject) => {
      this.playersDB.create(playerData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
  updatePlayer(id, updates) {
    return new Promise((resolve, reject) => {
      this.playersDB.update(id, updates, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
  async findPlayerByName(name) {
    const players = await this.getAllPlayers();
    return players.find(p => p.name.toLowerCase() === name.toLowerCase());
  }
}
