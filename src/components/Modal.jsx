import React from 'react';
import { X } from 'lucide-react';

/**
 * A reusable, mobile-first modal component.
 *
 * Props:
 * - isOpen: (boolean) Controls if the modal is visible.
 * - onClose: (function) Called when the modal is asked to close (backdrop click or 'X' button).
 * - title: (string) The title displayed at the top of the modal.
 * - children: (ReactNode) The content to display inside the modal.
 */
function Modal({ isOpen, onClose, title, children }) {
  // If not open, render nothing.
  if (!isOpen) {
    return null;
  }

  // Stop clicks inside the modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Backdrop: Fixed position, full screen, semi-transparent black
    // The `z-50` ensures it's on top of all other content.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      onClick={onClose} // Click on backdrop closes the modal
    >
      {/* Modal Panel: White bg, rounded, shadow, stops click propagation */}
      <div
        className="relative w-full max-w-lg rounded-lg bg-card text-card-foreground p-6 shadow-xl"
        onClick={handleModalContentClick}
      >
        {/* Modal Header: Title and Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
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