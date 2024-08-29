"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const priceSchema = new mongoose_1.Schema({
    location: { type: 'string', required: true },
    price: { type: 'string', required: true },
    date: { type: 'string', required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Price', priceSchema);
