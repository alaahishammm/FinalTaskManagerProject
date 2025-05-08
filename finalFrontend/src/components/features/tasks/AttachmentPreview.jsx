// src/components/features/tasks/AttachmentPreview.jsx
import { useState } from 'react';
import { FaFileImage, FaFilePdf, FaFileWord, FaFileAlt, FaTimes } from 'react-icons/fa';

const AttachmentPreview = ({ attachment, onClose }) => {
  const { filename, url } = attachment;
  const extension = filename.split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  
  if (!isImage) {
    return null; // Only show preview for images
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-100 flex justify-between items-center">
          <h3 className="font-medium">{filename}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>
        <div className="p-4 flex items-center justify-center overflow-auto">
          <img 
            src={url} 
            alt={filename} 
            className="max-w-full max-h-[70vh] object-contain" 
          />
        </div>
      </div>
    </div>
  );
};

export default AttachmentPreview;