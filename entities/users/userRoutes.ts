import express from 'express';
import userController from './userController.js';
import validate from '../../middlewares/inputValidator.js';
import { loginSchema, registerSchema, updateSchema } from '../../schemas/userSchemas.js';
import { adminOnly, auth } from '../../middlewares/auth.js';
const router = express.Router();

router.post('/register', validate(registerSchema, 'body'), userController.register);
router.post('/login', validate(loginSchema, 'body'), userController.login);
router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, validate(updateSchema, 'body'), userController.updateProfile);
router.get('/all', auth, adminOnly, userController.allUsers);

router.get('/user/allTables', userController.allTables);
export default router;