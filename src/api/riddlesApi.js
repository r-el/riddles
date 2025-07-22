import { API_CONFIG, getApiUrl } from "./config.js";

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
   * @param {Object} riddleData - The riddle to create
   * @returns {Promise<Object>} Created riddle
   */
  async create(riddleData) {
    const response = await fetch(getApiUrl("/riddles"), {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(riddleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create riddle: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Update an existing riddle
   * @param {string} id - Riddle ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated riddle
   */
  async update(id, updates) {
    if (!id) throw new Error("Riddle ID is required");

    const response = await fetch(getApiUrl(`/riddles/${id}`), {
      method: "PUT",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update riddle: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Delete a riddle
   * @param {string} id - Riddle ID
   * @returns {Promise<Object>} Deletion result
   */
  async delete(id) {
    if (!id) throw new Error("Riddle ID is required");

    const response = await fetch(getApiUrl(`/riddles/${id}`), {
      method: "DELETE",
      headers: API_CONFIG.HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete riddle: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Load initial riddles in bulk
   * @param {Array} riddles - Array of riddle objects
   * @returns {Promise<Object>} Result of bulk insertion
   */
  async loadInitial(riddles) {
    const response = await fetch(getApiUrl("/riddles/load-initial"), {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ riddles }),
    });

    if (!response.ok) {
      throw new Error(`Failed to load initial riddles: ${response.status}`);
    }

    return response.json();
  },
};
