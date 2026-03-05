import React from 'react';
import '../css/NoteInput.css';

interface NoteInputProps {
  note: string;
  setNote: (v: string) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ note, setNote }) => (
  <div>
    <label htmlFor="note-input-field" className="note-input-title">
      Note :
    </label>
    <div className="note-input-container">
      <input
        id="note-input-field"
        type="text"
        value={note}
        onChange={e => setNote(e.target.value)}
        className="note-input-field"
        placeholder="Ajouter une note..."
        aria-label="Note supplémentaire"
      />
    </div>
  </div>
);

export default NoteInput;
