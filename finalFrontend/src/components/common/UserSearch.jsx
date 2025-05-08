// src/components/common/UserSearch.jsx (update to better support multiple selections)
import { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { searchUserByEmail } from '../../services/userService';

const UserSearch = ({ onSelect, placeholder = "Search user by email...", buttonText = "Select" }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearchResult(null);
    
    searchUserByEmail(email.trim())
      .then(response => {
        setSearchResult(response.data.user);
      })
      .catch(error => {
        console.error('Error searching user:', error);
        setError(error.message || 'User not found with this email');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelect = () => {
    if (searchResult) {
      onSelect(searchResult);
      setEmail('');
      setSearchResult(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !email.trim()}
          className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Search'}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {searchResult && (
        <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white">
                {searchResult.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2">
                <p className="font-medium">{searchResult.name}</p>
                <p className="text-sm text-gray-600">{searchResult.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSelect}
              className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50"
            >
              {buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;