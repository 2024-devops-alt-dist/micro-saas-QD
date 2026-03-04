import React, { useEffect, useRef } from 'react';
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
  currentMonth: number;
  currentYear: number;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

const DateCarousel: React.FC<DateCarouselProps> = ({
  days,
  selectedDate,
  setSelectedDate,
  currentMonth,
  currentYear,
  onNextMonth,
  onPrevMonth,
}) => {
  // Format month display
  const monthDisplay = new Date(currentYear, currentMonth).toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  // Ref pour le wrapper du carrousel
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Centrer sur la date du jour si présente
    const todayIso = new Date().toISOString().slice(0, 10);
    const btn = wrapperRef.current?.querySelector<HTMLButtonElement>(
      `button[data-iso='${todayIso}']`
    );
    if (btn && wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const btnRect = btn.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      wrapper.scrollLeft = btn.offsetLeft - wrapperRect.width / 2 + btnRect.width / 2;
    }
  }, [days, currentMonth, currentYear]);

  return (
    <div>
      <div className="date-carousel-header">
        <span className="date-carousel-title">Séléctionner une date:</span>
      </div>
      <div className="date-carousel-header-nav">
        <button className="date-carousel-nav-btn" onClick={onPrevMonth} type="button">
          ←
        </button>
        <div className="date-carousel-month">{monthDisplay}</div>
        <button className="date-carousel-nav-btn" onClick={onNextMonth} type="button">
          →
        </button>
      </div>
      <div className="date-carousel-wrapper" ref={wrapperRef}>
        <div className="date-carousel">
          {days.map(d => (
            <button
              key={d.iso}
              data-iso={d.iso}
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
