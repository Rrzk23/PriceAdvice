import { Router } from 'express';
import * as authController from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, authController.getAuthenticatedUser);
router.post('/signup', authController.signUpUser);
router.post('/login', authController.loginUser); // Add POST route for filter
router.post('/logout', authController.logoutUser);

export default router;