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
const app_1 = __importStar(require("../../src/app"));
const globals_1 = require("@jest/globals");
const express_session_1 = require("express-session");
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
(0, globals_1.describe)('Authentication and Price Tests', () => {
    let agent;
    (0, globals_1.beforeEach)(() => {
        agent = supertest_1.default.agent(app_1.default);
    });
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clear the database after each test
        yield mongoose_1.default.connection.dropDatabase();
    }));
    (0, globals_1.it)('should sign up, create prices, and get prices', () => __awaiter(void 0, void 0, void 0, function* () {
        // Sign up
        const signupResponse = yield agent
            .post('/api/auth/signup')
            .send({
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
        });
        (0, globals_1.expect)(signupResponse.status).toBe(201);
        const userId = signupResponse.body._id;
        const user = yield agent
            .get('/api/auth/');
        (0, globals_1.expect)(user.status).toBe(200);
        // Create first price
        const priceResponse1 = yield agent
            .post('/api/prices/post')
            .send({
            location: 'Eastwood',
            price: '100',
            title: 'Title1',
        });
        (0, globals_1.expect)(priceResponse1.status).toBe(201);
        // Create second price
        const priceResponse2 = yield agent
            .post('/api/prices/post')
            .send({
            userId: userId,
            location: 'Westwood',
            price: '200',
            title: 'Title2',
        });
        (0, globals_1.expect)(priceResponse2.status).toBe(201);
        // Get prices
        const getPricesResponse = yield agent.get('/api/prices/getprices');
        (0, globals_1.expect)(getPricesResponse.status).toBe(200);
        (0, globals_1.expect)(getPricesResponse.body).toHaveLength(2);
        // Cleanup
        yield agent.delete('/api/prices/deleteprice/' + priceResponse1.body._id);
        yield agent.delete('/api/prices/deleteprice/' + priceResponse2.body._id);
        yield agent.post('/api/auth/logout');
    }));
});
(0, globals_1.describe)('Unit Tests for POST /prices/post and DELETE /prices/deleteprice/priceId', () => {
    let agent;
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post('/api/auth/signup')
            .send({
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
        });
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield agent.post('/api/auth/logout');
        yield mongoose_1.default.connection.dropDatabase();
    }));
    (0, globals_1.it)('should throw error of Posting price requires a location, price and title', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .post('/api/prices/post')
            .send({
            location: 'Eastwood',
            price: '',
            date: '',
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.error).toBe('Posting price requires a location, price and title');
    }));
    (0, globals_1.it)('should post a valid price and able to delete it, if the id is wrong it should return 400 or 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .post('/api/prices/post')
            .send({
            location: 'Eastwood',
            price: '100',
            title: 'title',
        });
        (0, globals_1.expect)(response.status).toBe(201);
        (0, globals_1.expect)(response.body.location).toBe('Eastwood');
        (0, globals_1.expect)(response.body.price).toBe('100');
        const testId = response.body._id;
        const invalid = new mongoose_1.default.Types.ObjectId().toString();
        const deleteResponse = yield agent.delete('/api/prices/deleteprice/' + 'abc');
        (0, globals_1.expect)(deleteResponse.status).toBe(400);
        (0, globals_1.expect)(deleteResponse.body.error).toBe('Invalid price id');
        const deleteResponse2 = yield agent.delete('/api/prices/deleteprice/' + invalid);
        (0, globals_1.expect)(deleteResponse2.status).toBe(404);
        (0, globals_1.expect)(deleteResponse2.body.error).toBe('Price not found');
        const deleteResponse3 = yield agent.delete('/api/prices/deleteprice/' + testId);
        (0, globals_1.expect)(deleteResponse3.status).toBe(200);
    }));
});
(0, globals_1.describe)('Unit Tests for GET /prices/getprice/:priceId', () => {
    let agent;
    let testPriceId;
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Seed the database with a test document
        agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post('/api/auth/signup')
            .send({
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
        });
        const response = yield agent
            .post('/api/prices/post')
            .send({ location: 'Eastwood', price: '100', title: 'Title' });
        testPriceId = response.body._id;
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Delete the test document after tests
        yield agent.delete('/api/prices/deleteprice' + testPriceId);
        yield agent.post('/api/auth/logout');
        yield mongoose_1.default.connection.dropDatabase();
    }));
    (0, globals_1.it)('shoult throws error 400 of invalid id for getting price', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .get('/api/prices/getprice/abc');
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.error).toBe('Invalid price id');
    }));
    (0, globals_1.it)('should return 404 for a non-existent price ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // Using a random or invalid ObjectId
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const response = yield agent
            .get('/api/prices/getprice/' + invalidId);
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body.error).toBe('Price not found');
    }));
    (0, globals_1.it)('should return 200 and get the correct price with the id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .get('/api/prices/getprice/' + testPriceId);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.location).toBe('Eastwood');
        (0, globals_1.expect)(response.body.price).toBe('100');
        //expect(Date.parse(response.body.date)).toBeInstanceOf(Date);
    }));
});
(0, globals_1.describe)('Unit Tests for Patch /updateprice/:priceId', () => {
    let agent;
    let testPriceId;
    (0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        agent = supertest_1.default.agent(app_1.default);
        yield agent
            .post('/api/auth/signup')
            .send({
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
        });
    }));
    (0, globals_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Seed the database with a test document
        const response = yield agent
            .post('/api/prices/post')
            .send({ location: 'Eastwood', price: '100', title: 'Title' });
        testPriceId = response.body._id;
    }));
    (0, globals_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Delete the test document after tests
        yield agent.delete('/api/prices/deleteprice' + testPriceId);
    }));
    (0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Delete the test document after tests
        yield agent.post('/api/auth/logout');
        yield mongoose_1.default.connection.dropDatabase();
    }));
    (0, globals_1.it)('shoult throws error 400 of invalid id for updating price with wrong id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .patch('/api/prices/updateprice/abc');
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.error).toBe('Invalid price id');
    }));
    (0, globals_1.it)('shoult throws error 400 for updating price with missing location filed', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .patch('/api/prices/updateprice/' + testPriceId)
            .send({
            price: '120',
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.error).toBe('Updating price missing a location');
    }));
    (0, globals_1.it)('shoult throws error 400 for updating price with missing title filed', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .patch('/api/prices/updateprice/' + testPriceId)
            .send({
            location: 'Burwood',
            price: '120',
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.error).toBe('Updating price missing a title');
    }));
    (0, globals_1.it)('shoult throws error 400 for updating price with missing price filed', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .patch('/api/prices/updateprice/' + testPriceId)
            .send({
            location: 'Burwood',
            price: '',
            title: 'Title',
        });
        (0, globals_1.expect)(response.status).toBe(400);
        (0, globals_1.expect)(response.body.error).toBe('Updating price missing a price');
    }));
    (0, globals_1.it)('should return 404 for a non-existent price ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // Using a random or invalid ObjectId
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const response = yield agent
            .patch('/api/prices/updateprice/' + invalidId)
            .send({
            location: 'Chatswood',
            price: '150',
            title: 'Title',
        });
        (0, globals_1.expect)(response.status).toBe(404);
        (0, globals_1.expect)(response.body.error).toBe('Price not found');
    }));
    (0, globals_1.it)('should return 200 and get the correct price with the id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield agent
            .patch('/api/prices/updateprice/' + testPriceId)
            .send({
            location: 'Chatswood',
            price: '150',
            title: 'Title',
        });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.location).toBe('Chatswood');
        (0, globals_1.expect)(response.body.price).toBe('150');
        //expect(Date.parse(response.body.date)).toBeInstanceOf(Date);
    }));
});
