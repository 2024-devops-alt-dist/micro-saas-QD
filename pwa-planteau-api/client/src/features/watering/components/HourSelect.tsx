import React, { useEffect } from 'react';
import '../css/HourSelect.css';

interface HourSelectProps {
  startHour: string;
  endHour: string;
  setStartHour: (h: string) => void;
  setEndHour: (h: string) => void;
  hours: string[];
}

function getHourInt(h: string) {
  return parseInt(h.split(':')[0], 10);
}

const HourSelect: React.FC<HourSelectProps> = ({
  startHour,
  endHour,
  setStartHour,
  setEndHour,
  hours,
}) => {
  // Filtrer les heures de fin : au moins 1h après startHour
  const startInt = getHourInt(startHour);
  const endHourOptions = hours.filter(h => getHourInt(h) > startInt);

  // Sélection automatique de l'heure de fin
  useEffect(() => {
    if (!endHourOptions.includes(endHour)) {
      setEndHour(endHourOptions[0] || '');
    }
  }, [startHour]);

  return (
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
              onChange={e => {
                setStartHour(e.target.value);
              }}
            >
              {hours.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
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
              <option value="" disabled>
                Choisir...
              </option>
              {endHourOptions.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourSelect;
