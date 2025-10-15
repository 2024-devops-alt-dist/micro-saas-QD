import React from 'react';

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
    <div className="font-pacifico text-green-900 text-lg mb-2">Rappel</div>
    <div className="text-xs text-gray-500 mb-2">N'oubliez pas vos tâches de demain</div>
    <div className="flex flex-col gap-2">
      {tomorrowTasks.length === 0 && <div className="text-gray-400 text-sm">Aucun rappel</div>}
      {tomorrowTasks.map((task) => (
        <div key={task.id_watering} className="bg-green-100 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="inline-block bg-green-300 rounded-full p-1 mr-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" rx="4" fill="#4ade80" /></svg>
          </span>
          <div>
            <div className="font-semibold text-green-900 text-sm">Arroser le {task.plantName}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span>12:00 - 16:00</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TomorrowReminders;
