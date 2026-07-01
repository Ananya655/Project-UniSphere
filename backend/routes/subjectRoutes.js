/**
 * Subject Routes
 * Maps subject endpoints to controller handlers.
 */

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getSubjects, createSubject } = require('../controllers/subjectController');

const router = express.Router();

// GET /api/subjects - List subjects by branch and semester
router.get('/', getSubjects);

// POST /api/subjects - Create a new subject (when user picks "Other")
router.post('/', protect, createSubject);

module.exports = router;
