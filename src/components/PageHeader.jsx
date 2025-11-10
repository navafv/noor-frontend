import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

function PageHeader({ title }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-lg items-center px-4">
        {/* Universal Back Button */}
        <button
          onClick={() => navigate(-1)} // This goes to the previous page
          className="p-2 text-noor-pink"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Page Title */}
        <h1 className="mx-auto text-lg font-semibold text-noor-heading">
          {title}
        </h1>
        
        {/* Spacer to keep title centered */}
        <div className="w-10"></div>
      </div>
    </header>
  );
}

export default PageHeader;