import mockData from '../data/mockPlants.json';
import { httpClient } from '../../../services/httpClient';

const USE_MOCK = false;

type Plant = {
  id: number;
  name: string;
  scientificName: string;
  type: string;
  image: string;
  waterNeed: string;
  room: string;
};

const getFullImageUrl = (photo: string | null | undefined): string => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  if (!photo) return '/placeholder.jpg';
  if (photo.startsWith('http')) return photo;
  if (photo.startsWith('/assets/')) return photo; // Sert par le client (Vite)
  if (photo.startsWith('/uploads/')) return `${API_BASE_URL}${photo}`;
  return photo;
};

const mockApi = {
  async getAll(): Promise<Plant[]> {
    // Retourne une copie des données mockées
    return [...mockData];
  },
  async create(plant: Omit<Plant, 'id'>): Promise<Plant> {
    // Simule la création d'une plante (id généré)
    return { id: Date.now(), ...plant };
  },
  async delete(_id: number): Promise<{ success: boolean }> {
    // Simule la suppression
    return { success: true };
  },
};

const realApi = {
  async getAll(): Promise<Plant[]> {
    try {
      const response = await httpClient.get<any[]>('/plants');
      return response.map(plant => ({
        id: plant.id,
        name: plant.name,
        scientificName: plant.scientific_name,
        type: plant.type,
        image: getFullImageUrl(plant.photo),
        waterNeed: plant.water_need,
        room: plant.room,
      }));
    } catch (error) {
      console.error('Failed to fetch plants:', error);
      throw error;
    }
  },
  async create(plant: Omit<Plant, 'id'>): Promise<Plant> {
    try {
      const response = await httpClient.post<any>('/plants', {
        name: plant.name,
        scientific_name: plant.scientificName,
        type: plant.type,
        photo: plant.image,
        water_need: plant.waterNeed,
        room: plant.room,
      });
      return {
        id: response.id,
        name: response.name,
        scientificName: response.scientific_name,
        type: response.type,
        image: getFullImageUrl(response.photo),
        waterNeed: response.water_need,
        room: response.room,
      };
    } catch (error) {
      console.error('Failed to create plant:', error);
      throw error;
    }
  },
  async delete(id: number): Promise<{ success: boolean }> {
    try {
      await httpClient.delete(`/plants/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete plant:', error);
      throw error;
    }
  },
};

export const plantService = USE_MOCK ? mockApi : realApi;
