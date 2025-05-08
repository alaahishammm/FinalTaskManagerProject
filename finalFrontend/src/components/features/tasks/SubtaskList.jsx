// src/components/features/tasks/SubtaskList.jsx
import { useState } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import SubtaskItem from './SubtaskItem';

const SubtaskList = ({ taskId, subtasks, onAddSubtask, onToggleSubtask, onDeleteSubtask }) => {
  const [newSubtask, setNewSubtask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSubtask.trim()) {
      return;
    }
    
    setIsAdding(true);
    
    try {
      await onAddSubtask({
        title: newSubtask.trim(),
        task: taskId,
      });
      setNewSubtask('');
    } catch (error) {
      console.error('Error adding subtask:', error);
      setError('Failed to add subtask');
    } finally {
      setIsAdding(false);
    }
  };

  // Calculate completion percentage
  const completedCount = subtasks.filter(subtask => subtask.is_completed).length;
  const completionPercentage = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Subtasks list */}
      <div className="space-y-1">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask._id}
            subtask={subtask}
            onToggle={onToggleSubtask}
            onDelete={onDeleteSubtask}
          />
        ))}
      </div>
      
      {/* Add new subtask form */}
      <form onSubmit={handleSubmit} className="mt-2">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Add an item"
            value={newSubtask}
            onChange={(e) => {
              setNewSubtask(e.target.value);
              if (error) setError('');
            }}
            className="w-full bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {isAdding && (
            <div className="ml-2">
              <FaSpinner className="animate-spin text-primary-500" />
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SubtaskList;