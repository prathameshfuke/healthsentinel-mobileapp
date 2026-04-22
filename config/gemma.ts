/**
 * Gemma Server Configuration
 *
 * Configure the connection to the local Gemma 2 9B FastAPI server.
 * The server runs on your M4 MacBook Air and the mobile app
 * connects to it over the local WiFi network.
 */

// ─── CHANGE THIS to your Mac's local IP address ─────────────────────
// Find it with: ifconfig | grep "inet " | grep -v 127.0.0.1
// Example: 192.168.1.42
const GEMMA_SERVER_HOST = '192.168.10.188';
const GEMMA_SERVER_PORT = 8000;

export const GEMMA_CONFIG = {
  /** Base URL for the Gemma FastAPI server */
  baseUrl: `http://${GEMMA_SERVER_HOST}:${GEMMA_SERVER_PORT}`,

  /** Request timeout in milliseconds (Gemma takes 5-16s per inference) */
  timeout: 30000,

  /** Number of retries on network failure */
  maxRetries: 2,

  /** Delay between retries in milliseconds */
  retryDelay: 1000,

  /** Whether to use Gemma or fall back to local logic */
  enabled: true,
};
