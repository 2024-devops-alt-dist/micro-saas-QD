import React from "react";

interface ThirstInputProps {
  thirst: number;
  setThirst: (n: number) => void;
}

const ThirstInput: React.FC<ThirstInputProps> = ({ thirst, setThirst }) => (
  <div className="mb-4">
    <label className="block text-gray-500 text-xs mb-1">Jauge de soif</label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={30}
        value={thirst}
        onChange={e => setThirst(Number(e.target.value))}
        className="w-16 px-2 py-1 border rounded text-center"
      />
      <span className="text-gray-400 text-xs">en jours</span>
    </div>
  </div>
);

export default ThirstInput;
