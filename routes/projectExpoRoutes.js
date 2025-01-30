import express from 'express';
import { createProjectExpo, getAllProjectExpos,getProjectExpoById, updateProjectExpo, deleteProjectExpo } from '../controllers/projectExpoControllers.js';
// import { verifyUserToken, adminTokenCheck } from '../middlewares/authMiddleware.js'; // Assuming middleware is defined separately
const router = express.Router();
import { verifyUserToken } from '../middleware/auth.js';
import adminTokenCheck from '../middleware/adminTokenCheck.js';

// Routes
router.post("/",verifyUserToken, createProjectExpo);
router.get("/",adminTokenCheck, getAllProjectExpos);
router.get("/:id",adminTokenCheck, getProjectExpoById);
router.put("/:id", adminTokenCheck,updateProjectExpo);
router.delete("/:id",adminTokenCheck, deleteProjectExpo);
export default router;
