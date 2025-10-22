const express = require('express');
const projectRoutes = require('./projectRoutes');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

// Define route groups
router.use('/projects', projectRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;