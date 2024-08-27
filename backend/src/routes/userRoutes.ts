import { Router } from 'express';
import { getUserProfile } from '../controllers/userController';


const router = Router();

router.get('/profile', getUserProfile);


export default router;