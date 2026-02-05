/**
 * HTTP Client for API communication
 * Centralized fetch wrapper with error handling and automatic credential inclusion
 * (for httpOnly cookie authentication)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ApiError extends Error {
  status?: number;
  response?: unknown;
}

/**
 * Common fetch options for all requests
 * includes: 'credentials' enables sending httpOnly cookies with each request
 */
const commonOptions: RequestInit = {
  credentials: 'include', // Include httpOnly cookies in requests
};

export const httpClient = {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        ...commonOptions,
      });

      if (!response.ok) {
        const error: ApiError = new Error(`HTTP Error: ${response.status}`);
        error.status = response.status;
        error.response = await response.json().catch(() => null);
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        ...commonOptions,
      });

      if (!response.ok) {
        const error: ApiError = new Error(`HTTP Error: ${response.status}`);
        error.status = response.status;
        error.response = await response.json().catch(() => null);
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        ...commonOptions,
      });

      if (!response.ok) {
        const error: ApiError = new Error(`HTTP Error: ${response.status}`);
        error.status = response.status;
        error.response = await response.json().catch(() => null);
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        ...commonOptions,
      });

      if (!response.ok) {
        const error: ApiError = new Error(`HTTP Error: ${response.status}`);
        error.status = response.status;
        error.response = await response.json().catch(() => null);
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  },
};
