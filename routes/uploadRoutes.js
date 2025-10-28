const express = require('express');
const router = express.Router();
const { getPresignedUrl } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// All upload routes require authentication
router.use(authMiddleware);

// GET /api/uploads/presign?filename=...&contentType=...
router.get('/presign', getPresignedUrl);

module.exports = router;
