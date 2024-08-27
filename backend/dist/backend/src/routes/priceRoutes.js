"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priceController_1 = require("../controllers/priceController");
const router = (0, express_1.Router)();
router.get('/realtime', priceController_1.getRealTimePrices);
router.post('/filter', priceController_1.getFilteredPrices); // Add POST route for filter
exports.default = router;
