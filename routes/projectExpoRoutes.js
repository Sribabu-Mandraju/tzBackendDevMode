import express from 'express';
import { createProject, getAllProjects, updateProject, deleteProject } from '../controllers/projectExpoController.js';
import { verifyUserToken, adminTokenCheck } from '../middlewares/authMiddleware.js'; // Assuming middleware is defined separately

const router = express.Router();

// Routes
router.post('/', verifyUserToken, createProject);
router.get('/', adminTokenCheck, getAllProjects);
router.put('/:id', verifyUserToken, updateProject);
router.delete('/:id', verifyUserToken, deleteProject);

export default router;
