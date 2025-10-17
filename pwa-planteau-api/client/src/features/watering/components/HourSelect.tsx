import React from 'react';

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
  <div className="mb-4">
    <label className="block text-gray-500 text-xs mb-1">Sélectionner l'heure</label>
    <div className="flex gap-4 justify-center">
      <select
        className="border rounded px-3 py-2 bg-gray-50 font-semibold"
        value={startHour}
        onChange={e => setStartHour(e.target.value)}
      >
        {hours.map(h => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-2xl text-gray-400">&rarr;</span>
      <select
        className="border rounded px-3 py-2 bg-gray-50 font-semibold"
        value={endHour}
        onChange={e => setEndHour(e.target.value)}
      >
        {hours.map(h => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default HourSelect;
