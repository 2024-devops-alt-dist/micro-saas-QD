import React from 'react';
import '../css/TomorrowReminders.css';

interface WateringTask {
  id_watering: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
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
      {tomorrowTasks.map(task => (
        <div key={task.id_watering} className="task-cards-reminder p-4 flex items-center gap-2">
          <img src="/assets/icons/icon-calendrier.png" alt="Calendrier" width={50} height={50} />

          <div>
            <div className="font-semibold text-green-900 text-sm">Arroser le {task.plantName}</div>
            <div className="text-info flex items-center gap-2 text-xs">
              <span>12:00 - 16:00</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TomorrowReminders;
