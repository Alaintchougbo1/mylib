'use client';

import { Search } from 'lucide-react';
import { InputHTMLAttributes, forwardRef } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, className = '', ...props }, ref) => {
    return (
      <div className={`search-bar ${className}`}>
        <Search className="search-icon w-5 h-5" />
        <input
          ref={ref}
          type="text"
          className="search-input"
          placeholder="Rechercher un livre, un auteur..."
          onChange={(e) => onSearch?.(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
