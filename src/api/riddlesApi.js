import { API_CONFIG, getApiUrl } from "./config.js";
import { networkUtils } from "../utils/networkUtils.js";

/**
 * RiddlesAPI - Low level API communication for riddles endpoints
 * Includes network resilience with retry logic and caching
 */
export const RiddlesAPI = {
  /**
   * Get all riddles with optional filters
   * Uses caching and fallback strategies for network resilience
   */
  async getAll({ level, limit, skip } = {}) {
    const cacheKey = `riddles_${level || "all"}_${limit || "all"}_${skip || 0}`;

    try {
      // Try cache first for quick response
      const cached = networkUtils.getCachedData(cacheKey);

      // Check server availability before attempting request
      const isServerAvailable = await networkUtils.isServerAvailable(getApiUrl("/health"));
      if (!isServerAvailable && cached) {
        console.log("Using cached riddles data (server unavailable)");
        return cached;
      }

      // Build query params
      const params = new URLSearchParams();
      if (level) params.append("level", level);
      if (limit) params.append("limit", limit);
      if (skip) params.append("skip", skip);

      const queryString = params.toString();
      const endpoint = `/riddles${queryString ? "?" + queryString : ""}`;

      // Attempt server request with retry logic
      const response = await networkUtils.fetchWithRetry(
        getApiUrl(endpoint),
        { headers: API_CONFIG.HEADERS },
        API_CONFIG.MAX_RETRIES
      );

      const data = await response.json();

      // Cache successful response
      networkUtils.cacheData(cacheKey, data, API_CONFIG.CACHE_TTL);

      return data;
    } catch (error) {
      console.error(`Error fetching riddles: ${error.message}`);

      // Fallback to cached data if available
      const cached = networkUtils.getCachedData(cacheKey);
      if (cached) {
        console.log("Using cached riddles data due to network error");
        return cached;
      }

      // Return empty structure as last resort
      return { success: false, count: 0, data: [] };
    }
  },

  /**
   * Get a random riddle
   * @returns {Promise<Object>} A random riddle
   */
  async getRandom() {
    const response = await fetch(getApiUrl("/riddles/random"), {
      headers: API_CONFIG.HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch random riddle: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get a specific riddle by ID
   * @param {string} id - Riddle ID
   * @returns {Promise<Object>} Riddle data
   */
  async getById(id) {
    if (!id) throw new Error("Riddle ID is required");

    const response = await fetch(getApiUrl(`/riddles/${id}`), {
      headers: API_CONFIG.HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch riddle: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Create a new riddle
   * Clears related cache entries on success
   */
  async create(riddleData) {
    try {
      const response = await networkUtils.fetchWithRetry(getApiUrl("/riddles"), {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(riddleData),
      });

      const data = await response.json();

      // Clear cache since we added new data
      networkUtils.clearCache("riddles_all");

      return data;
    } catch (error) {
      throw new Error(`Failed to create riddle: ${error.message}`);
    }
  },

  /**
   * Update an existing riddle
   * @param {string} id - Riddle ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated riddle
   */
  async update(id, updates) {
    if (!id) throw new Error("Riddle ID is required");

    try {
      const response = await networkUtils.fetchWithRetry(getApiUrl(`/riddles/${id}`), {
        method: "PUT",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      // Clear related cache entries
      networkUtils.clearCache(`riddle_${id}`);
      networkUtils.clearCache("riddles_all");

      return data;
    } catch (error) {
      throw new Error(`Failed to update riddle: ${error.message}`);
    }
  },

  /**
   * Delete a riddle
   * Clears related cache entries on success
   */
  async delete(id) {
    if (!id) throw new Error("Riddle ID is required");

    try {
      const response = await networkUtils.fetchWithRetry(getApiUrl(`/riddles/${id}`), {
        method: "DELETE",
        headers: API_CONFIG.HEADERS,
      });

      const data = await response.json();

      // Clear related cache entries
      networkUtils.clearCache(`riddle_${id}`);
      networkUtils.clearCache("riddles_all");

      return data;
    } catch (error) {
      throw new Error(`Failed to delete riddle: ${error.message}`);
    }
  },

  /**
   * Load initial riddles in bulk
   * Used for setting up default riddles in the system
   */
  async loadInitial(riddles) {
    try {
      const response = await networkUtils.fetchWithRetry(getApiUrl("/riddles/load-initial"), {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ riddles }),
      });

      const data = await response.json();

      // Clear all cache since we loaded new data
      networkUtils.clearAllCache();

      return data;
    } catch (error) {
      throw new Error(`Failed to load initial riddles: ${error.message}`);
    }
  },
};
