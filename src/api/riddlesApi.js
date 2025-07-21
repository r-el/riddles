import { API_CONFIG, getApiUrl } from "./config.js";

/**
 * RiddlesAPI - Low level API communication for riddles endpoints
 */
export const RiddlesAPI = {
  /**
   * Get all riddles with optional filters
   * @param {Object} options - Filter options
   * @param {string} options.level - Filter by difficulty level
   * @param {number} options.limit - Number of riddles to return
   * @param {number} options.skip - Number of riddles to skip
   * @returns {Promise<Object>} Response data
   */
  async getAll({ level, limit, skip } = {}) {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    if (limit) params.append("limit", limit);
    if (skip) params.append("skip", skip);

    const queryString = params.toString();
    const endpoint = `/riddles${queryString ? "?" + queryString : ""}`;

    const response = await fetch(getApiUrl(endpoint), {
      headers: API_CONFIG.HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch riddles: ${response.status}`);
    }

    return response.json();
  },
};
