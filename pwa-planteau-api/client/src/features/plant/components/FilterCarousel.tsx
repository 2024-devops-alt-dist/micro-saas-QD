import React, { useRef } from 'react';
import '../css/FilterCarousel.css';

interface FilterCarouselProps {
  filters: string[];
  active: string;
  onSelect: (filter: string) => void;
}

const FilterCarousel: React.FC<FilterCarouselProps> = ({ filters, active, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="plant-filter-carousel" ref={containerRef}>
      {filters.map(filter => (
        <button
          key={filter}
          className={active === filter ? 'active' : ''}
          onClick={() => onSelect(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterCarousel;
