import express from 'express';
import validate from '../../middlewares/inputValidator.js';
import statsController from './statsController.js';
import { auth, adminOnly } from '../../middlewares/auth.js';
const router = express.Router();

router.get('/topRooms', auth, adminOnly, statsController.topRooms);
router.get('/topUsers', auth, adminOnly, statsController.topUsers);

export default router;