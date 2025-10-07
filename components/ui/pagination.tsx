"use client";

import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showQuickNavigation?: boolean;
  showResultsSummary?: boolean;
}

function generatePageNumbers(currentPage: number, totalPages: number) {
  const delta = 2; // Number of pages to show on each side of current page
  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  // Add ellipsis after first page if needed
  if (rangeStart > 2) {
    pages.push('...');
  }

  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (rangeEnd < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page if there is more than one page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  showQuickNavigation = true,
  showResultsSummary = true
}: PaginationProps) {
  const [quickPageInput, setQuickPageInput] = useState(currentPage.toString());
  
  const pageNumbers = generatePageNumbers(currentPage, totalPages);
  
  const handlePageChange = (page: number) => {
    onPageChange(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickPageSubmit = () => {
    const page = parseInt(quickPageInput);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
  };

  const handleQuickPageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickPageSubmit();
    }
  };

  // Calculate the range of items being displayed
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  if (totalPages <= 1) {
    return (
      <div className="text-center text-gray-500 text-sm">
        {totalCount > 0 ? `Showing all ${totalCount} items` : 'No items found'}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Results Summary */}
      {showResultsSummary && totalCount > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {startIndex}-{endIndex} of {totalCount} items
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
        >
          ← Previous
        </button>
        
        {/* Page Numbers with Ellipsis */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
        >
          Next →
        </button>
      </div>

      {/* Quick Navigation */}
      {showQuickNavigation && (
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Go to page:</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={quickPageInput}
              onChange={(e) => setQuickPageInput(e.target.value)}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={handleQuickPageKeyPress}
            />
            <button
              onClick={handleQuickPageSubmit}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
