/**
 * HTTP Client for API communication
 * Centralized fetch wrapper with error handling and automatic credential inclusion
 * (for httpOnly cookie authentication)
 *
 * Features:
 * - Automatic JWT refresh on 401 errors
 * - Automatic retry of failed requests after token refresh
 * - Prevention of multiple simultaneous refresh attempts
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

/**
 * State for preventing multiple refresh attempts
 */
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Handle token refresh and automatic retry
 */
async function handleTokenRefresh(): Promise<void> {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing) {
    return refreshPromise || Promise.resolve();
  }

  isRefreshing = true;

  try {
    const { authService } = await import('../features/authentication/service/authService');
    refreshPromise = authService.refreshToken();
    await refreshPromise;
  } catch (error) {
    console.error('[httpClient] Token refresh failed, redirecting to login', error);
    // Clear auth state and redirect to login
    const { authService } = await import('../features/authentication/service/authService');
    authService.clearToken();
    window.location.href = '/login';
    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Execute fetch request with automatic refresh on 401
 */
async function executeRequest<T>(
  endpoint: string,
  method: string,
  data?: unknown,
  isRetry = false
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(data !== undefined && { body: JSON.stringify(data) }),
      ...commonOptions,
    });

    if (!response.ok) {
      // Handle 401 - attempt token refresh and retry
      if (response.status === 401 && !isRetry && endpoint !== '/auth/refresh') {
        console.warn(`[httpClient] Token expired, attempting refresh...`);
        try {
          await handleTokenRefresh();
          // Retry the original request
          return executeRequest<T>(endpoint, method, data, true);
        } catch (refreshError) {
          // If refresh fails, throw the original 401 error
          const error: ApiError = new Error(`HTTP Error: ${response.status}`);
          error.status = response.status;
          error.response = await response.json().catch(() => null);
          throw error;
        }
      }

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
}

export const httpClient = {
  async get<T>(endpoint: string): Promise<T> {
    return executeRequest<T>(endpoint, 'GET');
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return executeRequest<T>(endpoint, 'POST', data);
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return executeRequest<T>(endpoint, 'PUT', data);
  },

  async delete<T>(endpoint: string): Promise<T> {
    return executeRequest<T>(endpoint, 'DELETE');
  },
};
