"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTestApp = void 0;
const express_session_1 = __importDefault(require("express-session"));
const memorystore_1 = __importDefault(require("memorystore"));
const app_1 = __importDefault(require("../src/app")); // Import your original app
const MemoryStoreSession = (0, memorystore_1.default)(express_session_1.default);
function setupTestApp() {
    // Remove the existing session middleware
    app_1.default._router.stack = app_1.default._router.stack.filter((layer) => layer.name !== 'session');
    // Add a new session middleware with MemoryStore
    app_1.default.use((0, express_session_1.default)({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
        store: new MemoryStoreSession({
            checkPeriod: 86400000, // prune expired entries every 24h
        }),
    }));
    app_1.default.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });
    return app_1.default;
}
exports.setupTestApp = setupTestApp;
