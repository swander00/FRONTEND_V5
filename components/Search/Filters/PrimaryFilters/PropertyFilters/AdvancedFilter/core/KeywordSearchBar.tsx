"use client";

import { useState, useCallback, useId } from 'react';
import { Search, X } from 'lucide-react';

export default function KeywordSearchBar() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputId = useId();
  const labelId = useId();
  const descriptionId = useId();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const addKeyword = useCallback((keyword: string) => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (normalizedKeyword && !keywords.includes(normalizedKeyword)) {
      setKeywords(prev => [...prev, normalizedKeyword]);
      setInputValue('');
      
      // Announce to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Keyword "${normalizedKeyword}" added`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  }, [keywords]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addKeyword(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      removeKeyword(keywords.length - 1);
    }
  }, [inputValue, keywords.length, addKeyword]);

  const removeKeyword = useCallback((index: number) => {
    const removedKeyword = keywords[index];
    setKeywords(prev => prev.filter((_, i) => i !== index));
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Keyword "${removedKeyword}" removed`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, [keywords]);

  const clearAllKeywords = useCallback(() => {
    const count = keywords.length;
    setKeywords([]);
    setInputValue('');
    
    // Announce to screen readers
    if (count > 0) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `All ${count} keywords cleared`;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  }, [keywords.length]);

  return (
    <div className="relative">
      <label id={labelId} className="sr-only">
        Search for property features and keywords
      </label>
      
      <div 
        className="flex items-center min-h-[48px] px-3 sm:px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200"
        role="group"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
      >
        <Search 
          className="h-4 w-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" 
          aria-hidden="true"
        />
        
        {/* Keywords Display */}
        <div 
          className="flex flex-wrap items-center gap-2 flex-1 min-w-0"
          role="list"
          aria-label="Selected keywords"
        >
          {keywords.map((keyword, index) => (
            <div
              key={`keyword-${index}-${keyword}`}
              role="listitem"
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-lg border border-blue-200"
            >
              <span>{keyword}</span>
              <button
                onClick={() => removeKeyword(index)}
                type="button"
                className="p-0.5 hover:bg-blue-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[24px] min-w-[24px] flex items-center justify-center touch-manipulation"
                aria-label={`Remove keyword ${keyword}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ))}
          
          {/* Input Field */}
          <input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={keywords.length === 0 ? 'Search for features like "corner lot", "hardwood", "pool"...' : 'Add another keyword...'}
            className="flex-1 min-w-[150px] sm:min-w-[200px] bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            aria-autocomplete="list"
            role="searchbox"
          />
        </div>

        {/* Clear All Button */}
        {keywords.length > 0 && (
          <button
            onClick={clearAllKeywords}
            type="button"
            className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
            aria-label={`Clear all ${keywords.length} keyword${keywords.length !== 1 ? 's' : ''}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Helper Text */}
      <p id={descriptionId} className="text-xs text-gray-500 mt-2">
        Press Enter to add keywords. Search for property features, amenities, or specific details.
      </p>
    </div>
  );
}