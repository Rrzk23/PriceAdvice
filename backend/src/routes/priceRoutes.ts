import { Router } from 'express';
import * as priceController from '../controllers/priceController';

const router = Router();

router.get('/realtime', priceController.getRealTimePrices);
router.post('/filter', priceController.getFilteredPrices); // Add POST route for filter
router.get('/getPrices', priceController.getPrices);
router.post('/post', priceController.postPrice);
//get price by parapriceId
router.get('/getprice/:priceId', priceController.getPrice);
router.patch('/priceupdate/:priceId', priceController.updatePrice);
router.delete('/deleteprice/:priceId', priceController.deletePrice);
export default router;