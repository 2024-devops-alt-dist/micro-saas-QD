import React from 'react';
import '../css/WeekTasks.css';

type Watering = {
  id_watering: number;
  plantName: string;
  frequency: string;
  nextWatering: string;
};

interface WeekTasksProps {
  upcomingTasks: Record<string, Watering[]>;
  todayIso: string;
  tomorrowIso: string;
  weekDays: string[];
}

const WeekTasks: React.FC<WeekTasksProps> = ({
  upcomingTasks,
  todayIso,
  tomorrowIso,
  weekDays,
}) => {
  if (Object.entries(upcomingTasks).length === 0) {
    return null;
  }

  // Calculer la date de fin de semaine (dimanche)
  const today = new Date(todayIso);
  const dayOfWeek = today.getDay();
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7; // Si dimanche, affiche 7
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + daysUntilSunday);
  const endOfWeekIso = endOfWeek.toISOString().split('T')[0];

  return (
    <div className="week-tasks-section">
      <h3 className="week-tasks-title">Tâches de la semaine</h3>
      {Object.entries(upcomingTasks)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, tasks]) => {
          // Ne pas afficher les tâches d'aujourd'hui et demain (déjà affichées)
          if (date === todayIso || date === tomorrowIso) return null;

          // Ne pas afficher les tâches après dimanche
          if (date > endOfWeekIso) return null;

          const dateObj = new Date(date);
          const dayName = weekDays[dateObj.getDay()];
          const dayNum = dateObj.getDate();
          const monthName = dateObj.toLocaleString('fr-FR', { month: 'long' });

          return (
            <div key={date} className="week-tasks-day">
              <div className="week-tasks-header">
                <span className="week-tasks-date">
                  {dayName} {dayNum} {monthName}
                </span>
                <span className="week-tasks-count">
                  {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="week-tasks-cards">
                {tasks.map((task, idx) => (
                  <div key={idx} className="week-task-card">
                    <p className="week-task-name">{task.plantName}</p>
                    <p className="week-task-frequency">Fréquence: {task.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default WeekTasks;
