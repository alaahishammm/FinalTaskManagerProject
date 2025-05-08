const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {String} filename - Original filename
 * @param {String} folder - Cloudinary folder
 * @returns {Promise} - Cloudinary upload result
 */
const uploadBuffer = (buffer, filename, folder = 'task-tracker') => {
  return new Promise((resolve, reject) => {
    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Create an upload stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        filename_override: filename
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Pipe the readable stream to the upload stream
    stream.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary
 * @param {String} publicId - Public ID of the file to delete
 * @returns {Promise} - Cloudinary deletion result
 */
const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadBuffer,
  deleteFile
};