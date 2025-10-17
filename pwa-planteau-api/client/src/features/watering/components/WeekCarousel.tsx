
import React from 'react';
import '../css/WeekCarousel.css';

interface WeekDay {
  day: number;
  weekDay: string;
  iso: string;
  isToday: boolean;
}

interface WeekCarouselProps {
  week: WeekDay[];
}

const WeekCarousel: React.FC<WeekCarouselProps> = ({ week }) => (
  <div className="flex gap-2 justify-between mb-4">
    {week.map((d) => (
      <div
        key={d.iso}
  className={`flex flex-col items-center px-2 py-1 ${d.isToday ? 'week-selected' : ''}`}
      >
        <span className="text-xs font-semibold date-number">{d.day}</span>
  <span className={`text-xs font-bold ${d.isToday ? 'week-selected-text' : 'text-gray-400'}`}>{d.weekDay}</span>
  {d.isToday && <span className="w-2 h-2 week-dot rounded-full mt-1" />}
      </div>
    ))}
  </div>
);

export default WeekCarousel;
