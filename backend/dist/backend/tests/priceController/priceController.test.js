"use strict";
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
const app_1 = __importDefault(require("../../src/app"));
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    yield mongoose_1.default.connect(mongoUri);
}));
// Clean up after tests
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
describe('Unit Tests for POST /prices/post and DELETE /prices/deleteprice/priceId', () => {
    it('should throw error of Posting price requires a location, price and date', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/prices/post')
            .send({
            location: 'Eastwood',
            price: '',
            date: '',
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Posting price requires a location, price and date');
    }));
    it('should post a valid price and able to delete it, if the id is wrong it should return 400 or 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/prices/post')
            .send({
            location: 'Eastwood',
            price: '100',
            date: new Date(),
        });
        expect(response.status).toBe(201);
        expect(response.body.location).toBe('Eastwood');
        expect(response.body.price).toBe('100');
        const testId = response.body._id;
        const invalid = new mongoose_1.default.Types.ObjectId().toString();
        const deleteResponse = yield (0, supertest_1.default)(app_1.default).delete('/api/prices/deleteprice/' + 'abc');
        expect(deleteResponse.status).toBe(400);
        expect(deleteResponse.body.error).toBe('Invalid price id');
        const deleteResponse2 = yield (0, supertest_1.default)(app_1.default).delete('/api/prices/deleteprice/' + invalid);
        expect(deleteResponse2.status).toBe(404);
        expect(deleteResponse2.body.error).toBe('Price not found');
        const deleteResponse3 = yield (0, supertest_1.default)(app_1.default).delete('/api/prices/deleteprice/' + testId);
        expect(deleteResponse3.status).toBe(200);
    }));
});
describe('Unit Tests for GET /prices/getprice/:priceId', () => {
    let testPriceId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Seed the database with a test document
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/prices/post')
            .send({ location: 'Eastwood', price: '100', date: new Date() });
        testPriceId = response.body._id;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Delete the test document after tests
        yield (0, supertest_1.default)(app_1.default).delete('/api/prices/deleteprice' + testPriceId);
    }));
    it('shoult throws error 400 of invalid id for getting price', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/prices/getprice/abc');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid price id');
    }));
    it('should return 404 for a non-existent price ID', () => __awaiter(void 0, void 0, void 0, function* () {
        // Using a random or invalid ObjectId
        const invalidId = new mongoose_1.default.Types.ObjectId().toString();
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/prices/getprice/' + invalidId);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Price not found');
    }));
    it('should return 200 and get the correct price with the id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/api/prices/getprice/' + testPriceId);
        expect(response.status).toBe(200);
        expect(response.body.location).toBe('Eastwood');
        expect(response.body.price).toBe('100');
        //expect(Date.parse(response.body.date)).toBeInstanceOf(Date);
    }));
});
