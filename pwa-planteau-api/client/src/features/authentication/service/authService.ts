import { httpClient } from '../../../services/httpClient';

const TOKEN_KEY = 'jwt_token';

interface RegisterData {
  email: string;
  password: string;
  firstname?: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  status: number;
  message: string;
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
    // Token is stored in httpOnly cookie by the server
    return response;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', data);
    // Token is stored in httpOnly cookie by the server
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
    // Since we're using httpOnly cookies, we just check if we can access protected routes
    // A better approach would be to check with the server or use a context
    return true; // Let the server handle authentication via cookies
  },

  /**
   * Get token from localStorage (for optional use in headers)
   * Note: We primarily rely on httpOnly cookies sent automatically by the browser
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Store token in localStorage (optional, primarily use httpOnly cookies)
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
      await httpClient.post('/auth/refresh', {});
    } catch (error) {
      // If refresh fails, clear authentication
      this.clearToken();
      throw error;
    }
  },
};
