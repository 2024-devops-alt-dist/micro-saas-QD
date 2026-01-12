export interface User {
  id: number;
  name: string;
  firstname: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MEMBER';
  household_id: number;
}

export interface CreateUserDto {
  name: string;
  firstname: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MEMBER';
  household_id: number;
}
