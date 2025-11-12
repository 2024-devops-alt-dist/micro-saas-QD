import React from 'react';
import '../css/HourSelect.css';

interface HourSelectProps {
  startHour: string;
  endHour: string;
  setStartHour: (h: string) => void;
  setEndHour: (h: string) => void;
  hours: string[];
}

const HourSelect: React.FC<HourSelectProps> = ({
  startHour,
  endHour,
  setStartHour,
  setEndHour,
  hours,
}) => (
  <div className="hour-select-block">
    <label className="hour-select-label">Séléctionner l'heure:</label>
    <div className="hour-select-card">
      <div className="hour-select-col">
        <span className="hour-select-sub">De</span>
        <div className="hour-select-value">
          {startHour}
          <select
            className="hour-select-dropdown"
            value={startHour}
            onChange={e => setStartHour(e.target.value)}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="hour-select-arrow">
        <span>&gt;</span>
      </div>
      <div className="hour-select-col">
        <span className="hour-select-sub">à</span>
        <div className="hour-select-value">
          {endHour}
          <select
            className="hour-select-dropdown"
            value={endHour}
            onChange={e => setEndHour(e.target.value)}
          >
            {hours.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </div>
);

export default HourSelect;
