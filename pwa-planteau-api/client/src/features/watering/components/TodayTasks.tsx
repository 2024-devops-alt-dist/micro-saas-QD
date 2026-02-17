import React from 'react';
import '../css/TodayTasks.css';
import { Link } from 'react-router-dom';

interface WateringTask {
  id_watering: number;
  plantId: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
  taskLabel: string;
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
          className="task-cards px-4 py-2 font-semibold shadow flex flex-row items-center justify-between task-cards-hover"
        >
          <Link to={`/plants/${task.plantId}`} className="flex-1 text-left">
            {task.taskLabel} {task.plantName}
          </Link>
          <input
            type="checkbox"
            className="ml-3"
            // checked={false} // à remplacer par la vraie valeur si gestion du statut
            onChange={() => {}}
            aria-label="Marquer comme faite"
          />
        </div>
      ))}
    </div>
  </div>
);

export default TodayTasks;
