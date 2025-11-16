import React from 'react';
import { X } from 'lucide-react';

/**
 * A reusable, centered modal component.
 *
 * Props:
 * - isOpen: (boolean) Controls if the modal is visible.
 * - onClose: (function) Called when the modal is asked to close.
 * - title: (string) The title displayed at the top of the modal.
 * - children: (ReactNode) The content to display inside the modal.
 * - size: (string) 'sm', 'md', 'lg', 'xl' (defaults to 'lg')
 */
function Modal({ isOpen, onClose, title, children, size = 'lg' }) {
  if (!isOpen) {
    return null;
  }

  // Stop clicks inside the modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };
  
  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4
                 animate-in fade-in-0"
      onClick={onClose} // Click on backdrop closes the modal
    >
      {/* Modal Panel: White bg, rounded, shadow */}
      <div
        className={`relative w-full ${sizeClass} rounded-lg bg-card text-card-foreground p-6 shadow-xl
                    animate-in fade-in-0 zoom-in-95 slide-in-from-top-[10%]`}
        onClick={handleModalContentClick}
      >
        {/* Modal Header: Title and Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:bg-accent"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body: The content (e.g., the form) goes here */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;