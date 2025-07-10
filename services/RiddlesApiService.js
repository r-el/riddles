// services/RiddlesApiService.js
// Handles all API requests to the riddles server

const BASE_URL = "http://localhost:3000";

class RiddlesApiService {
  /**
   * Fetches all riddles from the server.
   * @returns {Promise<Array>} An array of riddle objects.
   * @throws {Error} If the fetch fails.
   */
  static async getAllRiddles() {
    const res = await fetch(`${BASE_URL}/riddles`);
    if (!res.ok) throw new Error("Failed to fetch riddles");
    return res.json();
  }

  /**
   * Fetches a riddle by its ID.
   * @param {number} id - The ID of the riddle to fetch.
   * @returns {Promise<Object>} The riddle object.
   * @throws {Error} If the fetch fails or the riddle is not found.
   */
  static async getRiddleById(id) {
    const res = await fetch(`${BASE_URL}/riddles/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("Riddle not found");
      throw new Error("Failed to fetch riddle");
    }
    return res.json();
  }
  
  /**
   * Adds a new riddle to the server.
   * @param {Object} riddle - The riddle object to add.
   * @returns {Promise<Object>} The added riddle object.
   * @throws {Error} If the addition fails.
   */
  static async addRiddle(riddle) {
    const res = await fetch(`${BASE_URL}/riddles/addRiddle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(riddle),
    });
    if (!res.ok) throw new Error("Failed to add riddle");
    return res.json();
  }

  /**
   * Updates an existing riddle.
   * @param {Object} riddle - The riddle object to update.
   * @returns {Promise<Object>} The updated riddle object.
   * @throws {Error} If the update fails.
   */
  static async updateRiddle(riddle) {
    const res = await fetch(`${BASE_URL}/riddles/updateRiddle`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(riddle),
    });
    if (!res.ok) throw new Error("Failed to update riddle");
    return res.json();
  }

  /**
   * Deletes a riddle by its ID.
   * @param {number} id - The ID of the riddle to delete.
   * @returns {Promise<Object>} The response from the server.
   * @throws {Error} If the deletion fails.
   * */
  static async deleteRiddle(id) {
    const res = await fetch(`${BASE_URL}/riddles/deleteRiddle`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Failed to delete riddle");
    return res.json();
  }
}

export default RiddlesApiService;
