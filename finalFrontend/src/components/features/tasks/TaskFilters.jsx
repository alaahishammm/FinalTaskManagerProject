// src/components/features/tasks/TaskFilters.jsx
import { useState, useEffect } from 'react';
import { FaFilter, FaSortAmountDown, FaTimes } from 'react-icons/fa';
import Button from '../../common/Button';

const TaskFilters = ({ onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    due_date_start: '',
    due_date_end: '',
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    // Check if any filter is active
    const activeFilters = Object.values(filters).some(value => value !== '');
    setHasActiveFilters(activeFilters);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      status: '',
      priority: '',
      due_date_start: '',
      due_date_end: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    onClearFilters();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`flex items-center px-3 py-2 rounded-md ${
            hasActiveFilters
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FaFilter className="mr-2" />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="ml-2 bg-white text-primary-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              !
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            <FaTimes className="mr-2" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="absolute mt-2 p-4 bg-white rounded-md shadow-lg z-10 w-72 border border-gray-200">
          <h3 className="font-medium mb-3">Filter Tasks</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (From)
              </label>
              <input
                type="date"
                name="due_date_start"
                value={filters.due_date_start}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (To)
              </label>
              <input
                type="date"
                name="due_date_end"
                value={filters.due_date_end}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;