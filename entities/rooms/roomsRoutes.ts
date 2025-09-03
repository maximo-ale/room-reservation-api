import express from 'express';
import validate from '../../middlewares/inputValidator.js';

import { createSchema, idSchema, updateSchema } from '../../schemas/roomSchemas.js';
import { adminOnly, auth } from '../../middlewares/auth.js';
import roomsController from './roomsController.js';
const router = express.Router();

router.post('/', auth, adminOnly, validate(createSchema, 'body'), roomsController.createRoom);
router.get('/all', auth, adminOnly, roomsController.getAllRooms);
router.get('/:room_id', auth, adminOnly, validate(idSchema, 'params'), roomsController.getRoomDetails);
router.patch('/:room_id', auth, adminOnly, validate(updateSchema, 'body'), validate(idSchema, 'params'), roomsController.updateRoom);
router.delete('/:room_id', auth, adminOnly, validate(idSchema, 'params'), roomsController.deleteRoom);

export default router;