import express from 'express';
import { createProject, getAllProjects, updateProject, deleteProject } from '../controllers/projectExplorerController.js';
// import { verifyUserToken, adminTokenCheck } from '../middlewares/authMiddleware.js'; // Assuming middleware is defined separately
const router = express.Router();
import { verifyUserToken } from '../middleware/auth.js';
import adminTokenCheck from '../middleware/adminTokenCheck.js';

// Routes
router.post('/', verifyUserToken, createProject);
router.get('/', adminTokenCheck, getAllProjects);
router.put('/:id', verifyUserToken, updateProject);
router.delete('/:id', verifyUserToken, deleteProject);

export default router;
