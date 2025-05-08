/**
 * Async Handler Wrapper to handle exceptions in async express routes
 * Eliminates need for try/catch blocks in controller functions
 * @param {Function} fn - The async function to be wrapped
 * @returns {Function} - Express middleware function with error handling
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
  
  module.exports = asyncHandler;