import React from 'react';
import '../css/ThirstInput.css';

interface ThirstInputProps {
  thirst: number;
  setThirst: (n: number) => void;
}

const ThirstInput: React.FC<ThirstInputProps> = ({ thirst, setThirst }) => (
  <div>
    <label className="thirst-input-title">Jauge de soif :</label>
    <div className="thirst-input-container">
      <span className="thirst-input-icon" aria-label="Jauge de soif">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ verticalAlign: 'middle' }}
        >
          <path
            d="M6 11h10M6 15h10M6 7h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="thirst-input-label">En jours :</span>
      <select
        className="thirst-input-select"
        value={thirst}
        onChange={e => setThirst(Number(e.target.value))}
      >
        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ThirstInput;
