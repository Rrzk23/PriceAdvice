"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = require("express-session");
const globals_1 = require("@jest/globals");
const app_1 = __importStar(require("../../src/app"));
let mongoServer;
(0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    yield mongoose_1.default.connect(mongoUri);
    const memoryStore = new express_session_1.MemoryStore();
    (0, app_1.setSessionStore)(memoryStore);
    (0, app_1.applySessionMiddleware)(app_1.default);
}));
(0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
(0, globals_1.describe)('Authentication and Session Tests', () => {
    let agent;
    (0, globals_1.beforeAll)(() => {
        agent = supertest_1.default.agent(app_1.default);
    });
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clear the database after each test
        yield mongoose_1.default.connection.dropDatabase();
    }));
    (0, globals_1.it)('should sign up a user and maintain session', () => __awaiter(void 0, void 0, void 0, function* () {
        const signupResponse = yield agent
            .post('/api/auth/signup')
            .send({
            username: 'testuser2',
            email: 'testuser2@example.com',
            password: 'password123',
        });
        (0, globals_1.expect)(signupResponse.status).toBe(201);
    }));
    (0, globals_1.it)('should login a user and maintain session', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, create a user
        const signupResponse = yield agent
            .post('/api/auth/signup')
            .send({
            username: 'loginuser',
            email: 'loginuser@example.com',
            password: 'password123',
        });
        (0, globals_1.expect)(signupResponse.status).toBe(201);
        // Now, login
        const loginResponse = yield agent
            .post('/api/auth/login')
            .send({
            userNameOrEmail: 'loginuser',
            password: 'password123',
        });
        (0, globals_1.expect)(loginResponse.status).toBe(201);
        const user = yield agent
            .get('/api/auth/');
        (0, globals_1.expect)(user.status).toBe(200);
    }));
});
