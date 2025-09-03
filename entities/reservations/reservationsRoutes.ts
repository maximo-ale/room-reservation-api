import express from 'express';
import reservationsController from './reservationsController.js';
import { adminOnly, auth } from '../../middlewares/auth.js';
import validate from '../../middlewares/inputValidator.js';
import { createSchema, filterSchema, reservationIdSchema, roomIdSchema } from '../../schemas/reservationSchemas.js';
const router = express.Router();

router.post('/', auth, validate(createSchema, 'body'), reservationsController.createReservation);
router.get('/me', auth, reservationsController.getReservations);
router.get('/details/:reservation_id', auth, validate(reservationIdSchema, 'params'), reservationsController.getReservationDetails);
router.patch('/cancel/:reservation_id', auth, validate(reservationIdSchema, 'params'), reservationsController.cancelReservation);
router.get('/roomReservations/:room_id', auth, validate(roomIdSchema, 'params'), reservationsController.getRoomReservations);
router.get('/', auth, adminOnly, validate(filterSchema, 'query'), reservationsController.getAllReservations);

export default router;