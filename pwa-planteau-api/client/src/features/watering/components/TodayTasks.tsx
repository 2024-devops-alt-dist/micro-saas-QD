import React from 'react';
import '../css/TodayTasks.css';

interface WateringTask {
  id_watering: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
}

interface TodayTasksProps {
  todayTasks: WateringTask[];
}

const TodayTasks: React.FC<TodayTasksProps> = ({ todayTasks }) => (
  <div className="mb-2">
    <div className="subtitle text-lg mb-2 text-left">Vos Tâches du jour</div>
    <div className="flex flex-col gap-3">
      {todayTasks.length === 0 && <div className="text-info text-xs">Aucune tâche aujourd'hui</div>}
      {todayTasks.map(task => (
        <div
          key={task.id_watering}
          className="task-cards px-4 py-2 font-semibold shadow flex items-center"
        >
          <span>{task.plantName ? `Arroser le ${task.plantName}` : 'Tâche'}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TodayTasks;
