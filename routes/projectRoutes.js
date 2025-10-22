const express = require('express');
const router = express.Router();
const { saveProject, getProject, updateProject, listProjects, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/save', saveProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.get('/', listProjects);
router.delete('/:id', deleteProject);

module.exports = router;
