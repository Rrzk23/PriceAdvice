import { Router } from 'express';
import * as userController from '../controllers/userController';


const router = Router();

router.get('/profile', userController.getUserProfile);



export default router;