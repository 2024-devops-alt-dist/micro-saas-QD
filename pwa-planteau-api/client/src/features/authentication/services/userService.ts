/**
 * Service pour gérer les opérations utilisateur
 */

import api from '../../../services/apiClient';

export interface User {
  id: number;
  email: string;
  firstname: string;
  name?: string;
  photo?: string;
  role: string;
  household_id: number;
}

export interface UpdateUserData {
  photo?: string;
  firstname?: string;
  name?: string;
}

export const userService = {
  /**
   * Mettre à jour les données utilisateur
   */
  async updateUser(userId: number, data: UpdateUserData): Promise<User> {
    try {
      const response = await api.put<User>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  /**
   * Obtenir les informations de l'utilisateur par ID
   */
  async getUser(userId: number): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  },
};
