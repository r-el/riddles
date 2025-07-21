/**
 * API Configuration Module
 * Centralized configuration for all API communications
 */

// Load environment variables if available
const BASE_URL = process.env.BASE_RIDDLES_SERVER_URL || "http://localhost:3000";

export const API_CONFIG = {
  BASE_URL,
  HEADERS: {
    "Content-Type": "application/json",
  },
  TIMEOUT: 10000, // 10 seconds
};

/**
 * Get complete API URL for an endpoint
 * @param {string} endpoint - API endpoint (e.g., "/riddles")
 * @returns {string} Complete URL
 */
export function getApiUrl(endpoint) {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
}

/**
 * Get default headers for API requests
 * @returns {Object} Headers object
 */
export function getDefaultHeaders() {
  return { ...API_CONFIG.HEADERS };
}
