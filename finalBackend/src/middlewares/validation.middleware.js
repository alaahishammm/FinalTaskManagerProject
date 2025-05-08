/**
 * Validation middleware factory
 * Creates middleware to validate request data against a Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} source - Request property to validate ('body', 'params', 'query')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    console.log('Validating with schema:', schema._flags?.label || 'Unknown schema');
    console.log('Request body:', req[source]);
    
    const { error } = schema.validate(req[source], { abortEarly: false });
    
    if (!error) {
      console.log('Validation passed');
      return next();
    }

    console.log('Validation failed:', error.details);
    
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails
    });
  };
};

module.exports = { validate };