import mockData from '../data/mockWatering.json';

const USE_MOCK = true;

type Watering = {
  id_watering: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
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
    // À implémenter plus tard avec fetch/axios
    return [];
  },
  async create(watering: Omit<Watering, 'id_watering'>): Promise<Watering> {
    return { id_watering: Date.now(), ...watering };
  },
  async delete(_id: number): Promise<{ success: boolean }> {
    return { success: true };
  },
};

export const wateringService = USE_MOCK ? mockApi : realApi;
