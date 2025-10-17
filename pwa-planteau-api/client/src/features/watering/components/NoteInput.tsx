import React from 'react';

interface NoteInputProps {
  note: string;
  setNote: (v: string) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ note, setNote }) => (
  <div className="mb-4">
    <label className="block text-gray-500 text-xs mb-1">Note</label>
    <input
      type="text"
      value={note}
      onChange={e => setNote(e.target.value)}
      className="w-full px-3 py-2 border rounded"
      placeholder="Ajouter une note..."
    />
  </div>
);

export default NoteInput;
