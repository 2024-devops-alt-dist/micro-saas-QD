import React, { useCallback } from 'react';
import '../css/TodayTasks.css';
import { Link } from 'react-router-dom';
import { wateringService } from '../services/wateringService';

interface WateringTask {
  id_watering: number;
  plantId: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
  taskLabel: string;
  status?: string;
}

interface TodayTasksProps {
  todayTasks: WateringTask[];
  onStatusChange?: () => void;
}

const TodayTasks: React.FC<TodayTasksProps> = ({ todayTasks, onStatusChange }) => {
  const handleCheckbox = useCallback(
    async (task: WateringTask) => {
      const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
      await wateringService.updateStatus(task.id_watering, newStatus);
      if (onStatusChange) onStatusChange();
    },
    [onStatusChange]
  );

  return (
    <div className="mb-2">
      <div className="subtitle text-lg mb-2 text-left">Vos Tâches du jour</div>
      <div className="flex flex-col gap-3">
        {todayTasks.length === 0 && (
          <div className="text-info text-xs">Aucune tâche aujourd'hui</div>
        )}
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
              checked={task.status === 'DONE'}
              onChange={() => handleCheckbox(task)}
              aria-label="Marquer comme faite"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayTasks;
