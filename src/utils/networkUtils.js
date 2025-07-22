import localStorage from "./storage.js";
import { getApiUrl } from "../api/config.js";

/**
 * Network utilities for handling API requests with retry logic and caching
 */
export const networkUtils = {
  /**
   * Fetch with automatic retry for failed requests
   * Uses exponential backoff strategy for retries
   */
  async fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;
    let retryDelay = 1000; // Start with 1 second delay

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Create abort controller for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const requestOptions = {
          ...options,
          signal: controller.signal,
        };

        // Attempt the fetch request
        const response = await fetch(url, requestOptions);

        clearTimeout(timeoutId);

        // Check if response is successful
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        return response;
      } catch (error) {
        lastError = error;

        // Don't retry on timeout or client errors
        if (error.name === "AbortError") {
          throw new Error("Request timed out after 8 seconds");
        }

        // Don't retry on client errors (4xx status codes)
        if (error.message.includes("4")) {
          throw error;
        }

        // Retry logic for server errors
        if (attempt < maxRetries) {
          console.log(`Request failed, retrying (${attempt + 1}/${maxRetries})...`);

          // Exponential backoff with jitter to avoid thundering herd
          const jitter = Math.random() * 0.3 + 0.85; // Random factor between 0.85-1.15
          await new Promise((resolve) => setTimeout(resolve, retryDelay * jitter));
          retryDelay *= 2; // Double the delay for next attempt
        }
      }
    }

    throw lastError;
  },
};
