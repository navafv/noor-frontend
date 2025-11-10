import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * A standardized header for all student portal pages and admin content pages.
 * It provides a consistent "Back" button and a centered title.
 * * Props:
 * - title: (string) The title to display.
 * - showBackButton: (boolean) Optional, defaults to true. Set to false to hide the back button (e.g., on main dashboard).
 */
function PageHeader({ title, showBackButton = true }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 w-full bg-card shadow-sm border-b border-border">
      {/* Use max-w-lg for Student/Mobile view, max-w-4xl for Admin/Desktop view */}
      <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
        
        {/* Back Button */}
        <div className="w-10"> {/* Spacer div */}
          {showBackButton && (
            <button
              onClick={() => navigate(-1)} // This goes to the previous page in history
              className="p-2 text-primary rounded-full hover:bg-accent"
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
        
        {/* Page Title */}
        <h1 className="mx-auto text-lg font-semibold text-foreground text-center truncate">
          {title}
        </h1>
        
        {/* Spacer to keep title centered */}
        <div className="w-10"></div>
      </div>
    </header>
  );
}

export default PageHeader;