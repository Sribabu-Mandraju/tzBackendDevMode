import express from 'express';
import {
  createHackathon,
  getAllHackathons,
  updateHackathon,
  deleteHackathon,
} from '../controllers/hackathonController.js';

const router = express.Router();

router.post('/', createHackathon);
router.get('/', getAllHackathons);
router.put('/:id', updateHackathon);
router.delete('/:id', deleteHackathon);

export default router;
