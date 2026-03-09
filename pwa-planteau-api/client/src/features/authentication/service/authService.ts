import api from '../../../services/apiClient';

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
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Logout - clear cookies and call server
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Get current authenticated user info
   */
  async getCurrentUser(): Promise<{
    user: {
      id: number;
      email: string;
      firstname: string;
      role: string;
      household_id: number;
      photo?: string;
    };
  }> {
    const response = await api.get('/auth/me');
    return response.data as {
      user: {
        id: number;
        email: string;
        firstname: string;
        role: string;
        household_id: number;
        photo?: string;
      };
    };
  },

  /**
   * Check if user is authenticated by calling /auth/me
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<void> {
    await api.post<AuthResponse>('/auth/refresh', {});
  },

  /**
   * Alias for getCurrentUser() for consistency with AuthContext
   */
  async me(): Promise<{
    user: {
      id: number;
      email: string;
      firstname: string;
      role: string;
      household_id: number;
      photo?: string;
    };
  }> {
    return this.getCurrentUser();
  },
};
