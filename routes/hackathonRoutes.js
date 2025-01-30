import express from 'express';
import {
  createHackathon,
  getAllHackathons,
  updateHackathon,
  deleteHackathon,
} from '../controllers/hackathonController.js';

import { verifyUserToken } from '../middleware/auth.js';
import adminTokenCheck from '../middleware/adminTokenCheck.js';

const router = express.Router();

router.post('/',verifyUserToken, createHackathon);
router.get('/', adminTokenCheck,getAllHackathons);
router.put('/:id',adminTokenCheck, updateHackathon);
router.delete('/:id',adminTokenCheck, deleteHackathon);

export default router;
