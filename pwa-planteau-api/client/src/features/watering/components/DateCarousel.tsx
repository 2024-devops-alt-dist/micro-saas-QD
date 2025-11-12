import React from 'react';
import '../css/DateCarousel.css';


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

const DateCarousel: React.FC<DateCarouselProps> = ({ days, selectedDate, setSelectedDate }) => {
  // Get current month from selectedDate or first day
  const currentIso = selectedDate || (days.length > 0 ? days[0].iso : null);
  const currentMonth = currentIso ? new Date(currentIso).toLocaleString('fr-FR', { month: 'long', year: 'numeric' }) : '';

  return (
    <div>
      <div className="date-carousel-header">
        <span className="date-carousel-title">Séléctionner une date:</span>
      </div>
      <div className="date-carousel-month">
        {currentMonth}
      </div>
      <div className="date-carousel-wrapper">
        <div className="date-carousel">
          {days.map(d => (
            <button
              key={d.iso}
              className={`date-card${selectedDate === d.iso ? ' selected' : ''}`}
              onClick={() => setSelectedDate(d.iso)}
              type="button"
            >
              <span className="date-card-number">{d.label}</span>
              <span className="date-card-week">{d.week}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateCarousel;
