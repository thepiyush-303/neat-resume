import axios from 'axios';

/**
 * Shared Axios instance for all API calls.
 * Reads base URL from Vite env at build time.
 * Use this instead of importing directly from AuthContext.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});
