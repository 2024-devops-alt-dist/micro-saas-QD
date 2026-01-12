export interface Tasks {
  id: number;
  type:
    | 'WATERING'
    | 'REPOTTING'
    | 'PRUNING'
    | 'SPRAYING'
    | 'CLEAN_LEAVES'
    | 'FERTILIZING'
    | 'DEADHEADING';
  scheduled_date: string;
  status: 'TODO' | 'DONE' | 'SKIPPED';
  plant_id: number;
}

export interface CreateTasksDto {
  type:
    | 'WATERING'
    | 'REPOTTING'
    | 'PRUNING'
    | 'SPRAYING'
    | 'CLEAN_LEAVES'
    | 'FERTILIZING'
    | 'DEADHEADING';
  scheduled_date: string;
  status: 'TODO' | 'DONE' | 'SKIPPED';
  plant_id: number;
}
