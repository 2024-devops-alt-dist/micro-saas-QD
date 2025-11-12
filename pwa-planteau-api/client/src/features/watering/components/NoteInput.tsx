import React from 'react';
import '../css/NoteInput.css';

interface NoteInputProps {
  note: string;
  setNote: (v: string) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ note, setNote }) => (
  <div>
    <label className="note-input-title">Note :</label>
    <div className="note-input-container">
      <input
        type="text"
        value={note}
        onChange={e => setNote(e.target.value)}
        className="note-input-field"
        placeholder="Ajouter une note..."
      />
    </div>
  </div>
);

export default NoteInput;
