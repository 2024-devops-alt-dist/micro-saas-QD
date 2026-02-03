import mockData from '../data/mockWatering.json';
import { httpClient } from '../../../services/httpClient';

const USE_MOCK = false;

type Watering = {
  id_watering: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
};

type TaskResponse = {
  id: number;
  type: string;
  scheduled_date: string;
  status: string;
  plant_id: number;
};

const mockApi = {
  async getAll(): Promise<Watering[]> {
    // Retourne une copie des données mockées
    return [...mockData];
  },
  async create(watering: Omit<Watering, 'id_watering'>): Promise<Watering> {
    // Simule la création d'un arrosage (id généré)
    return { id_watering: Date.now(), ...watering };
  },
  async delete(_id: number): Promise<{ success: boolean }> {
    // Simule la suppression
    return { success: true };
  },
};

const realApi = {
  async getAll(): Promise<Watering[]> {
    try {
      const response = await httpClient.get<TaskResponse[]>('/tasks');
      return response
        .filter(task => task.type === 'WATERING')
        .map(task => ({
          id_watering: task.id,
          plantName: `Plant ${task.plant_id}`,
          frequency: 'À déterminer',
          nextWatering: new Date(task.scheduled_date).toLocaleDateString(),
        }));
    } catch (error) {
      console.error('Failed to fetch watering tasks:', error);
      throw error;
    }
  },
  async create(watering: Omit<Watering, 'id_watering'>): Promise<Watering> {
    try {
      const response = await httpClient.post<TaskResponse>('/tasks', {
        type: 'WATERING',
        scheduled_date: new Date().toISOString(),
        status: 'TODO',
        plant_id: 1, // À adapter selon le contexte
      });
      return {
        id_watering: response.id,
        plantName: watering.plantName,
        frequency: watering.frequency,
        nextWatering: new Date(response.scheduled_date).toLocaleDateString(),
      };
    } catch (error) {
      console.error('Failed to create watering task:', error);
      throw error;
    }
  },
  async delete(id: number): Promise<{ success: boolean }> {
    try {
      await httpClient.delete(`/tasks/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete watering task:', error);
      throw error;
    }
  },
};

export const wateringService = USE_MOCK ? mockApi : realApi;
