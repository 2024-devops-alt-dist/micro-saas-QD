import React from 'react';

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
        className={`flex flex-col items-center px-2 py-1 rounded-lg min-w-[40px] ${d.isToday ? 'bg-green-100 border-2 border-green-500' : ''}`}
      >
        <span className="text-xs font-semibold text-gray-500">{d.day}</span>
        <span className={`text-xs font-bold ${d.isToday ? 'text-green-700' : 'text-gray-400'}`}>{d.weekDay}</span>
        {d.isToday && <span className="w-2 h-2 bg-green-500 rounded-full mt-1" />}
      </div>
    ))}
  </div>
);

export default WeekCarousel;
