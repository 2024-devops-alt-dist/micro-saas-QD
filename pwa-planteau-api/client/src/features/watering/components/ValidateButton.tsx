import React from 'react';
import '../css/ValidateButton.css';

interface ValidateButtonProps {
  label?: string;
}

const ValidateButton: React.FC<ValidateButtonProps> = ({
  label = 'Encore une bonne action à faire',
}) => (
  <button
    type="submit"
    className="validate-btn"
  >
    {label}
  </button>
);

export default ValidateButton;
