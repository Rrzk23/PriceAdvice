import { Router } from 'express';
import { getRealTimePrices, getFilteredPrices } from '../controllers/priceController';

const router = Router();

router.get('/realtime', getRealTimePrices);
router.post('/filter', getFilteredPrices); // Add POST route for filter

export default router;