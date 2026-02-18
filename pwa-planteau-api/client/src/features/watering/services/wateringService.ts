import mockData from '../data/mockWatering.json';
import { httpClient } from '../../../services/httpClient';

const USE_MOCK = false;

type Watering = {
  id_watering: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
  taskLabel?: string;
  type?: string;
  plantId: number;
};

type TaskResponse = {
  id: number;
  type: string;
  scheduled_date: string;
  status: string;
  plant_id: number;
  plant?: {
    id: number;
    name: string;
  };
};

const mockApi = {
  async updateStatus(_id: number, _status: string): Promise<void> {
    // No-op for mock
    return;
  },
  async getAll(): Promise<Watering[]> {
    // Retourne une copie des données mockées
    return mockData.map(item => ({
      ...item,
      taskLabel: item.frequency || 'Arrosage',
      plantId: item.plantId || 1,
    }));
  },
  async create(watering: Omit<Watering, 'id_watering'>): Promise<Watering> {
    // Simule la création d'un arrosage (id généré)
    return {
      id_watering: Date.now(),
      ...watering,
      taskLabel: watering.frequency || 'Arrosage',
    };
  },
  async delete(_id: number): Promise<{ success: boolean }> {
    // Simule la suppression
    return { success: true };
  },
};

const realApi = {
  async updateStatus(id: number, status: string): Promise<void> {
    await httpClient.put(`/tasks/${id}`, { status });
  },
  async getAll(): Promise<Watering[]> {
    try {
      const response = await httpClient.get<TaskResponse[]>('/tasks');
      // Map type to readable label
      const typeLabels: Record<string, string> = {
        WATERING: 'Arrosage',
        REPOTTING: 'Rempotage',
        PRUNING: 'Taille',
        SPRAYING: 'Vaporiser',
        CLEAN_LEAVES: 'Nettoyer les feuilles',
        FERTILIZING: 'Engrais',
        DEADHEADING: 'Supprimer fleurs fanées',
      };
      return response.map(task => ({
        id_watering: task.id,
        plantId: task.plant?.id || task.plant_id,
        plantName: task.plant?.name || `Plant ${task.plant_id}`,
        frequency: typeLabels[task.type] || task.type,
        nextWatering: task.scheduled_date,
        taskLabel: typeLabels[task.type] || task.type,
        status: task.status,
      }));
    } catch (error) {
      console.error('Failed to fetch watering tasks:', error);
      throw error;
    }
  },
  async create(
    watering: Omit<Watering, 'id_watering'>,
    options?: {
      startHour?: string;
      endHour?: string;
      note?: string;
      thirst?: number;
      plantId?: number;
      type?: string;
    }
  ): Promise<Watering> {
    try {
      // Combiner la date et l'heure de début
      const dateOnly = watering.nextWatering; // Format: YYYY-MM-DD
      const hour = options?.startHour || '00:00'; // Format: HH:mm
      const [h, m] = hour.split(':');
      // Format: YYYY-MM-DDTHH:mm:ss (sans millisecondes ni Z)
      const scheduledDateString = `${dateOnly}T${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;

      const response = await httpClient.post<TaskResponse>('/tasks', {
        type: options?.type || 'WATERING',
        scheduled_date: scheduledDateString,
        status: 'TODO',
        plant_id: options?.plantId || 1,
        frequency_days: options?.thirst || undefined,
      });
      return {
        id_watering: response.id,
        plantName: watering.plantName,
        frequency: watering.frequency,
        nextWatering: response.scheduled_date.slice(0, 10),
        taskLabel: watering.frequency || 'Arrosage',
        type: options?.type || 'WATERING',
        plantId: options?.plantId || 1,
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

export const wateringService: typeof realApi = USE_MOCK ? mockApi : realApi;
