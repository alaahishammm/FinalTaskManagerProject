const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Please upload an image, PDF, or document file.'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = {
  uploadSingle: upload.single('file'),
  uploadMultiple: upload.array('files', 5) // Allow up to 5 files
};