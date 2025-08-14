import React, { useState, useRef, useEffect } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      // Add your search logic here
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Search Button - Always visible */}
      <button
        onClick={handleSearchToggle}
        className={`p-2 rounded-full transition-all duration-300 ${
          isOpen ? "bg-gray-100" : "hover:bg-gray-100"
        }`}
        aria-label={isOpen ? "Close search" : "Open search"}
      >
        {isOpen ? (
          <HiXMark className="w-5 h-5 text-gray-600" />
        ) : (
          <HiMagnifyingGlass className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Search Input - Slides in when opened */}
      <div
        className={`absolute right-0 top-full mt-2 w-72 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full py-3 pl-4 pr-10 text-sm border-none focus:ring-0 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Submit search"
          >
            <HiMagnifyingGlass className="w-5 h-5" />
          </button>
        </form>

        {/* Recent searches dropdown (optional) */}
        {searchTerm && (
          <div className="border-t border-gray-100 py-2 px-3 text-xs text-gray-500">
            <p>Press Enter to search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
