import mockData from '../data/mockPlants.json';
import api from '../../../services/apiClient';

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
  // Si l'URL commence par http/https, c'est Cloudinary → retourner tel quel
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  if (photo.startsWith('/assets/')) return photo; // Sert par le client (Vite)
  if (photo.startsWith('/uploads/')) return `${API_BASE_URL}${photo}`;
  return photo;
};

const mockApi = {
  async getAll(): Promise<Plant[]> {
    // Retourne une copie des données mockées
    return [...mockData];
  },
  async create(plant: Omit<Plant, 'id'>, _userId: number, _householdId: number): Promise<Plant> {
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
      const response = await api.get<any[]>('/plants');
      return response.data.map(plant => ({
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
  async create(plant: Omit<Plant, 'id'>, userId: number, householdId: number): Promise<Plant> {
    try {
      const response = await api.post<any>('/plants', {
        name: plant.name,
        scientific_name: plant.scientificName,
        type: plant.type,
        photo: plant.image,
        water_need: plant.waterNeed,
        room: plant.room,
        user_id: userId,
        household_id: householdId,
      });
      const plantData = response.data;
      return {
        id: plantData.id,
        name: plantData.name,
        scientificName: plantData.scientific_name,
        type: plantData.type,
        image: getFullImageUrl(plantData.photo),
        waterNeed: plantData.water_need,
        room: plantData.room,
      };
    } catch (error) {
      console.error('Failed to create plant:', error);
      throw error;
    }
  },
  async delete(id: number): Promise<{ success: boolean }> {
    try {
      await api.delete(`/plants/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete plant:', error);
      throw error;
    }
  },
};

export const plantService = USE_MOCK ? mockApi : realApi;
