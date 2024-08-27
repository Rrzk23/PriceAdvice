import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

router.get('/register', registerUser);
router.post('/login', loginUser); // Add POST route for filter

export default router;