export interface Note {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  plant_id?: number;
  task_id?: number;
}

export interface CreateNoteDto {
  content: string;
  user_id: number;
  plant_id?: number;
  task_id?: number;
}
