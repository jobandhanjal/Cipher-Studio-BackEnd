const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Project = require('../models/Project');

const router = express.Router();

// Dashboard endpoint
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;