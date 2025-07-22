/**
 * API Configuration Module
 * Centralized configuration for all API communications
 */

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get base URL from env
const BASE_URL = process.env.BASE_RIDDLES_SERVER_URL || "http://localhost:3000";

// Remove trailing slash if present for consistency
const normalizedBaseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;

export const API_CONFIG = {
  BASE_URL: normalizedBaseUrl,
  HEADERS: {
    "Content-Type": "application/json",
  },
  TIMEOUT: 8 * 1000, // 8 seconds timeout
  CACHE_TTL: 1000 * 60 * 60, // Cache time-to-live: 1 hour
  MAX_RETRIES: 3, // Maximum retry attempts
};

/**
 * Get complete API URL for an endpoint
 * @param {string} endpoint - API endpoint (e.g., "/riddles")
 * @returns {string} Complete URL
 */
export function getApiUrl(endpoint) {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.BASE_URL}${normalizedEndpoint}`;
}

/**
 * Get default headers for API requests
 * @returns {Object} Headers object
 */
export function getDefaultHeaders() {
  return { ...API_CONFIG.HEADERS };
}
