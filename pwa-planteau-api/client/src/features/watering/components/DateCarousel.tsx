import React from "react";

type Day = {
  label: string;
  week: string;
  iso: string;
};

interface DateCarouselProps {
  days: Day[];
  selectedDate: string;
  setSelectedDate: (iso: string) => void;
}

const DateCarousel: React.FC<DateCarouselProps> = ({ days, selectedDate, setSelectedDate }) => (
  <div className="mb-4">
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((d) => (
        <button
          key={d.iso}
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[56px] transition ${
            selectedDate === d.iso
              ? 'bg-green-700 text-white border-2 border-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setSelectedDate(d.iso)}
          type="button"
        >
          <span className={`text-base font-bold ${selectedDate === d.iso ? 'text-white' : 'text-gray-700'}`}>{d.label}</span>
          <span className={`text-xs ${selectedDate === d.iso ? 'text-white' : 'text-gray-700'}`}>{d.week}</span>
        </button>
      ))}
    </div>
  </div>
);

export default DateCarousel;
