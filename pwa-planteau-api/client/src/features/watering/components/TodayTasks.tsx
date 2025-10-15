import React from 'react';

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
    <div className="font-pacifico text-green-900 text-lg mb-2">Vos Tâches du jour</div>
    <div className="flex flex-col gap-4">
      {todayTasks.length === 0 && <div className="text-gray-400 text-sm">Aucune tâche aujourd'hui</div>}
      {todayTasks.map((task) => (
        <div key={task.id_watering} className="bg-green-300 text-green-900 rounded-xl px-4 py-2 font-semibold shadow flex items-center">
          <span>{task.plantName ? `Arroser le ${task.plantName}` : 'Tâche'}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TodayTasks;
