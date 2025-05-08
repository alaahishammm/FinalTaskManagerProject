// src/components/features/tasks/CommentList.jsx
import { useState } from 'react';
import { FaPaperPlane, FaTrash, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../common/Button';

const CommentItem = ({ comment, onDelete, currentUser }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        await onDelete(comment._id);
      } catch (error) {
        console.error('Error deleting comment:', error);
        setIsDeleting(false);
      }
    }
  };
  
  const isAuthor = currentUser && comment.author && currentUser._id === comment.author._id;

  return (
    <div className="flex space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
          {comment.author?.name.charAt(0).toUpperCase() || '?'}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            {comment.author?.name || 'Unknown User'}
          </p>
          <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
        </div>
        <p className="text-sm text-gray-500 mt-1">{comment.content}</p>
      </div>
      {isAuthor && (
        <div className="flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
          </button>
        </div>
      )}
    </div>
  );
};

const CommentList = ({ taskId, comments, onAddComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    setIsAdding(true);
    setError('');
    
    try {
      await onAddComment({
        content: newComment.trim(),
        task_id: taskId,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Comments</h3>
      
      <div className="mb-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            onDelete={onDeleteComment}
            currentUser={user}
          />
        ))}
        
        {comments.length === 0 && (
          <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-2">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              if (error) setError('');
            }}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            rows={3}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isAdding || !newComment.trim()}
            isLoading={isAdding}
          >
            <FaPaperPlane className="mr-2" /> Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentList;