import express from 'express';
import { createProjectExpo, getAllProjectExpos,getProjectExpoById, updateProjectExpo, deleteProjectExpo } from '../controllers/projectExpoControllers.js';
// import { verifyUserToken, adminTokenCheck } from '../middlewares/authMiddleware.js'; // Assuming middleware is defined separately
const router = express.Router();
import { verifyUserToken } from '../middleware/auth.js';
import adminTokenCheck from '../middleware/adminTokenCheck.js';

// Routes
router.post("/", createProjectExpo);
router.get("/", getAllProjectExpos);
router.get("/:id", getProjectExpoById);
router.put("/:id", updateProjectExpo);
router.delete("/:id", deleteProjectExpo);
export default router;
