"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.get('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser); // Add POST route for filter
exports.default = router;