import React from "react";

interface ValidateButtonProps {
  label?: string;
}

const ValidateButton: React.FC<ValidateButtonProps> = ({ label = "Encore une bonne action à faire" }) => (
  <button
    type="submit"
    className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded-full font-semibold mb-4 transition"
  >
    {label}
  </button>
);

export default ValidateButton;
