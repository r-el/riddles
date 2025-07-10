// services/PlayersApiService.js
// Handles all API requests to the players server

const BASE_URL = "http://localhost:3000";

class PlayersApiService {
  /**
   * Fetches all players from the server.
   * @returns {Promise<Array>} An array of player objects.
   * @throws {Error} If the fetch fails.
   */
  static async getAllPlayers() {
    const res = await fetch(`${BASE_URL}/players`);
    if (!res.ok) throw new Error("Failed to fetch players");
    return res.json();
  }

  /**
   * Adds a new player to the server.
   * @param {Object} player - The player object to add.
   * @returns {Promise<Object>} The added player object.
   * @throws {Error} If the addition fails.
   */
  static async addPlayer(player) {
    const res = await fetch(`${BASE_URL}/players/addPlayer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    if (!res.ok) throw new Error("Failed to add player");
    return res.json();
  }

  /**
   * Updates an existing player.
   * @param {Object} player - The player object to update (must include id).
   * @returns {Promise<Object>} The updated player object.
   * @throws {Error} If the update fails.
   */
  static async updatePlayer(player) {
    const res = await fetch(`${BASE_URL}/players/updatePlayer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    if (!res.ok) throw new Error("Failed to update player");
    return res.json();
  }

  /**
   * Deletes a player by its ID.
   * @param {number} id - The ID of the player to delete.
   * @returns {Promise<Object>} The response from the server.
   * @throws {Error} If the deletion fails.
   */
  static async deletePlayer(id) {
    const res = await fetch(`${BASE_URL}/players/deletePlayer`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Failed to delete player");
    return res.json();
  }
}

export default PlayersApiService;
