import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.get('/register', authController.registerUser);
router.post('/login', authController.loginUser); // Add POST route for filter

export default router;