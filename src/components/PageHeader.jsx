import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft size={20} />
      Back
    </button>
  );
}

/**
 * A standard page header for all app pages.
 * @param {string} title - The title to display.
 * @param {boolean} [showBackButton=true] - Show the back button.
 * @param {React.ReactNode} [children] - Elements to render on the right (e.g., buttons).
 */
function PageHeader({ title, showBackButton = true, children }) {
  return (
    <header className="sticky top-0 z-10 w-full bg-card shadow-sm border-b border-border">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Back Button & Title */}
        <div className="flex-1 min-w-0">
          {showBackButton && <BackButton />}
          <h1 className="truncate text-2xl font-bold leading-tight text-foreground md:text-3xl">
            {title}
          </h1>
        </div>
        
        {/* Right Side: Action Buttons */}
        <div className="shrink-0 ml-4">
          {children}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;