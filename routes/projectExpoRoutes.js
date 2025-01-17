const express = require('express');
const router = express.Router();
const projectExpoController = require('../controllers/projectExpoController');

// Routes
router.post('/projects',verifyUserToken, projectExpoController.createProject);
router.get('/projects',adminTokenCheck, projectExpoController.getAllProjects);
router.put('/projects/:id',verifyUserToken, projectExpoController.updateProject);
router.delete('/projects/:id',verifyUserToken, projectExpoController.deleteProject);

module.exports = router;
