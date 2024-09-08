"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: 'string', required: true, unique: true },
    email: { type: 'string', required: true, unique: true, select: false },
    password: { type: 'string', required: true, select: false },
});
exports.default = (0, mongoose_1.model)('User', userSchema);