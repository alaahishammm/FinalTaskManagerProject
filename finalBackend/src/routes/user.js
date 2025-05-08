const express = require('express');
const { register, login, logout, getProfile, updateProfile ,findUserByEmail } = require('../controllers/user');
const { authenticate } = require('../middlewares/authentication.middelware.js');
const { validate } = require('../middlewares/validation.middleware.js');
const { registerSchema, loginSchema, updateProfileSchema ,searchUserSchema } = require('../validation.schemas/user');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.get('/search', authenticate, validate(searchUserSchema, 'query'), findUserByEmail);
module.exports = router;
