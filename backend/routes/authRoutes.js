/**
 * Authentication Routes
 * Maps auth endpoints to controller handlers.
 */

const express = require('express');
const { register, login, getProfile, updateProfile, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register - Create a new student account
router.post('/register', register);

// POST /api/auth/login - Authenticate an existing student
router.post('/login', login);

// GET /api/auth/profile - Fetch authenticated user's profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile - Update authenticated user's profile
router.put('/profile', protect, updateProfile);

// DELETE /api/auth/account - Permanently delete authenticated user's account
router.delete('/account', protect, deleteAccount);

module.exports = router;
