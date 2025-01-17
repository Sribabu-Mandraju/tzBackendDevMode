const express = require('express');
const router = express.Router();
const projectExpoController = require('../controllers/projectExpoController');

// Routes
router.post('/',verifyUserToken, projectExpoController.createProject);
router.get('/',adminTokenCheck, projectExpoController.getAllProjects);
router.put('/:id',verifyUserToken, projectExpoController.updateProject);
router.delete('/:id',verifyUserToken, projectExpoController.deleteProject);

module.exports = router;
