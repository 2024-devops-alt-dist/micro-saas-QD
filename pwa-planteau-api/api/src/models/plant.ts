// Modèle TypeScript pour Plant (entité complète)
export interface Plant {
  id: number;
  name: string;
  scientific_name: string;
  type: string;
  photo: string;
  water_need: string;
  room: string;
  user_id: number;
  household_id: number;
}

// DTO pour la création d'une plante (sans id, ni household_id/user_id si gérés côté service)
export interface CreatePlantDto {
  name: string;
  scientific_name: string;
  type: string;
  photo: string;
  water_need: string;
  room: string;
  user_id: number;
  household_id: number;
}
