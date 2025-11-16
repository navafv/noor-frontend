import React from 'react';

/**
 * A reusable pagination component.
 * @param {number} currentPage - The current active page (1-based).
 * @param {number} totalPages - The total number of pages.
 * @param {function} onPageChange - Callback function when page is changed, receives (pageNumber).
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null; // Don't render if only one page
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-t border-border">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="btn-outline btn-sm"
      >
        Previous
      </button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="btn-outline btn-sm"
      >
        Next
      </button>
    </div>
  );
}
export default Pagination;