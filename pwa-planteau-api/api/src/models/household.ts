export interface Household {
  id: number;
  name: string;
  invite_code: string;
}

export interface CreateHouseholdDto {
  name: string;
  invite_code: string;
}
