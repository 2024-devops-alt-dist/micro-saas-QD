import React from 'react';
import '../css/TomorrowReminders.css';
import { Link } from 'react-router-dom';

interface WateringTask {
  id_watering: number;
  plantId: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
  taskLabel: string;
}

interface TomorrowRemindersProps {
  tomorrowTasks: WateringTask[];
}

const TomorrowReminders: React.FC<TomorrowRemindersProps> = ({ tomorrowTasks }) => (
  <div className="mt-6">
    <div className="subtitle mb-2 text-left text-lg">Rappel</div>
    <div className="text-info mb-2 text-left">N'oubliez pas vos tâches de demain</div>
    <div className="flex flex-col gap-3">
      {tomorrowTasks.length === 0 && (
        <div className="task-cards p-4 text-gray-400 text-sm">Aucun rappel</div>
      )}
      {tomorrowTasks.map(task => {
        let time = '';
        try {
          const dateObj = new Date(task.nextWatering);
          // Format as HH:mm (24h)
          time = dateObj.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        } catch {
          time = '';
        }
        return (
          <Link
            key={task.id_watering}
            to={`/plants/${task.plantId}`}
            className="task-cards-reminder p-4 flex items-center gap-2 task-cards-hover"
          >
            <img src="/assets/icons/icon-calendrier.png" alt="Calendrier" width={50} height={50} />
            <div>
              <div className="font-semibold text-green-900 text-sm">
                {task.taskLabel} {task.plantName}
              </div>
              <div className="text-info flex items-center gap-2 text-xs">
                <span>{time}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

export default TomorrowReminders;
