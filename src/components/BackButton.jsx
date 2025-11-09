import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * A reusable button component that navigates the user to the previous page.
 */
function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back one step in history
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-sm font-medium text-gray-600 hover:text-noor-heading transition-colors mb-4"
    >
      <ChevronLeft size={20} className="mr-1" />
      Back
    </button>
  );
}

export default BackButton;