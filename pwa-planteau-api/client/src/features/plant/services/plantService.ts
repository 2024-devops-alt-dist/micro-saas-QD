import mockData from '../data/mockPlants.json';

const USE_MOCK = true;

type Plant = {
  id: number;
  name: string;
  scientificName: string;
  type: string;
  image: string;
  waterNeed: string;
  room: string;
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
    // À implémenter plus tard avec fetch/axios
    return [];
  },
  async create(plant: Omit<Plant, 'id'>): Promise<Plant> {
    return { id: Date.now(), ...plant };
  },
  async delete(_id: number): Promise<{ success: boolean }> {
    return { success: true };
  },
};

export const plantService = USE_MOCK ? mockApi : realApi;
