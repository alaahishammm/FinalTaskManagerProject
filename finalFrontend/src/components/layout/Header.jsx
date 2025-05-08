// src/components/layout/Header.jsx
import { useState } from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';

const Header = ({ title }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality later
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              className="px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-400" />
            </div>
          </form>
          
          <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;