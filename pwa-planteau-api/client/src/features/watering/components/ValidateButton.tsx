import React from 'react';
import '../css/ValidateButton.css';

interface ValidateButtonProps {
  label?: string;
  disabled?: boolean;
}

const ValidateButton: React.FC<ValidateButtonProps> = ({
  label = 'Encore une bonne action à faire',
  disabled = false,
}) => (
  <button type="submit" className="validate-btn" disabled={disabled}>
    {label}
  </button>
);

export default ValidateButton;
