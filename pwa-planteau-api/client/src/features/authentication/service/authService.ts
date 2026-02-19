import { httpClient } from '../../../services/httpClient';

const TOKEN_KEY = 'jwt_token';

interface RegisterData {
  email: string;
  password: string;
  firstname?: string;
  name?: string;
  inviteCode?: string;
  householdName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  status: number;
  message: string;
  accessToken?: string;
  user: {
    id: number;
    email: string;
    role: string;
    firstname?: string;
  };
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/register', data);
    // Store JWT token from response
    if (response.accessToken) {
      this.setToken(response.accessToken);
    }
    return response;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', data);
    // Store JWT token from response
    if (response.accessToken) {
      this.setToken(response.accessToken);
    }
    return response;
  },

  /**
   * Logout - clear token and call server
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout', {});
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Get current authenticated user info
   */
  async getCurrentUser(): Promise<{
    user: { id: number; email: string; firstname: string; role: string };
  }> {
    const response = await httpClient.get('/auth/me');
    return response as { user: { id: number; email: string; firstname: string; role: string } };
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Store token in localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Clear token from localStorage
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<void> {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/refresh', {});
      // Store refreshed JWT token from response
      if (response.accessToken) {
        this.setToken(response.accessToken);
      }
    } catch (error) {
      // If refresh fails, clear authentication
      this.clearToken();
      throw error;
    }
  },
};
