/**
 * Resource Routes
 * Maps resource endpoints to controller handlers.
 */

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadResource: uploadPdf } = require('../middleware/uploadMiddleware');
const {
  uploadResource,
  getResources,
  getMyResources,
  downloadResource,
} = require('../controllers/resourceController');

const router = express.Router();

// GET /api/resources - List resources with optional filters
router.get('/', getResources);

// GET /api/resources/mine - List current user's uploads
router.get('/mine', protect, getMyResources);

// POST /api/resources/upload - Upload a PDF academic resource
router.post('/upload', protect, uploadPdf, uploadResource);

// POST /api/resources/:id/download - Track download and return file URL
router.post('/:id/download', downloadResource);

module.exports = router;
