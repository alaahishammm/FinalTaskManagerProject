// src/components/features/tasks/TaskAttachments.jsx
import { useState } from 'react';
import { FaUpload, FaFile, FaFileImage, FaFileAlt, FaFilePdf, FaFileWord, FaTrash, FaSpinner } from 'react-icons/fa';
import { uploadTaskAttachment, deleteTaskAttachment } from '../../../services/taskService';
import Button from '../../common/Button';

const FileIcon = ({ filename }) => {
  const extension = filename.split('.').pop().toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return <FaFileImage className="text-blue-500" />;
  } else if (extension === 'pdf') {
    return <FaFilePdf className="text-red-500" />;
  } else if (['doc', 'docx'].includes(extension)) {
    return <FaFileWord className="text-blue-700" />;
  } else {
    return <FaFileAlt className="text-gray-500" />;
  }
};

const TaskAttachments = ({ taskId, attachments = [], onAttachmentAdded, onAttachmentDeleted }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);

      const response = await uploadTaskAttachment(taskId, fileToUpload);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Notify parent component
      if (onAttachmentAdded) {
        onAttachmentAdded(response.data.attachment);
      }
      
      // Reset state
      setFileToUpload(null);
      
      // Reset file input
      document.getElementById('file-upload').value = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500); // Short delay to show completion
    }
  };

  const handleDelete = async (publicId) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      setDeletingId(publicId);
      try {
        await deleteTaskAttachment(taskId, publicId);
        
        // Notify parent component
        if (onAttachmentDeleted) {
          onAttachmentDeleted(publicId);
        }
      } catch (error) {
        console.error('Error deleting attachment:', error);
        alert('Failed to delete attachment. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Attachments</h3>
      
      {/* File Upload Section */}
      <div className="border border-gray-300 rounded-md p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label 
              htmlFor="file-upload" 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <FaUpload className="text-primary-600" />
              <span className="text-gray-600">
                {fileToUpload ? fileToUpload.name : 'Select a file to upload'}
              </span>
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={!fileToUpload || isUploading}
            isLoading={isUploading}
          >
            Upload
          </Button>
        </div>
        
        {isUploading && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-full bg-primary-600 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
          </div>
        )}
        
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        
        <p className="text-xs text-gray-500 mt-4">
          Allowed file types: Images (.jpg, .png), Documents (.pdf, .doc, .docx)
          <br />
          Maximum file size: 5MB
        </p>
      </div>
      
      {/* Attachments List */}
      {attachments.length > 0 ? (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {attachments.map((attachment) => (
              <li key={attachment.public_id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FileIcon filename={attachment.filename} />
                  <div>
                    <a 
                      href={attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {attachment.filename}
                    </a>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(attachment.public_id)}
                  disabled={deletingId === attachment.public_id}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  {deletingId === attachment.public_id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
          No attachments yet
        </div>
      )}
    </div>
  );
};

export default TaskAttachments;