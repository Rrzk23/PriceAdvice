import { Router } from 'express';
import * as priceController from '../controllers/priceController';


const router = Router();

// Add POST route for filter
router.get('/getprices', priceController.getPrices);
router.post('/post', priceController.postPrice);
//get price by parapriceId
router.get('/getprice/:priceId', priceController.getPrice);
router.patch('/updateprice/:priceId', priceController.updatePrice);
router.delete('/deleteprice/:priceId', priceController.deletePrice);
export default router;