// src/components/features/tasks/SubtaskItem.jsx
import { useState } from 'react';
import { FaTrash, FaSpinner } from 'react-icons/fa';

const SubtaskItem = ({ subtask, onToggle, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(subtask._id);
    } catch (error) {
      console.error('Error toggling subtask:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this subtask?')) {
      setIsDeleting(true);
      try {
        await onDelete(subtask._id);
      } catch (error) {
        console.error('Error deleting subtask:', error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center px-3 py-2 hover:bg-gray-50">
      <label className="flex items-center cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={subtask.is_completed}
          onChange={handleToggle}
          disabled={isToggling}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <span className={`ml-2 text-sm ${subtask.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {subtask.title}
        </span>
      </label>
      
      {isToggling && (
        <div className="mr-2">
          <FaSpinner className="animate-spin text-xs text-gray-400" />
        </div>
      )}
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-gray-400 hover:text-red-500 p-1 ml-2"
      >
        {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
      </button>
    </div>
  );
};

export default SubtaskItem;