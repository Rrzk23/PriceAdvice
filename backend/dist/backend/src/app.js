"use strict";
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
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
exports.applySessionMiddleware = exports.setSessionStore = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config.js");
const axios_1 = __importDefault(require("axios"));
const priceRoutes_1 = __importDefault(require("./routes/priceRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const priceProcessing_1 = __importDefault(require("./priceProcessing"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importStar(require("http-errors"));
const express_session_1 = __importDefault(require("express-session"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./middleware/auth");
// Initialize environment variables
// Create an Express application
const app = (0, express_1.default)();
app.use(express_1.default.json());
let sessionMiddleware = (0, express_session_1.default)({
    secret: validateEnv_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: validateEnv_1.default.DB_URL,
    }),
});
function setSessionStore(store) {
    sessionMiddleware = (0, express_session_1.default)({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000,
        },
        rolling: true,
        store: store,
    });
}
exports.setSessionStore = setSessionStore;
// Use a function to apply session middleware
function applySessionMiddleware(app2) {
    app2.use(sessionMiddleware);
}
exports.applySessionMiddleware = applySessionMiddleware;
// Apply the session middleware
applySessionMiddleware(app);
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
// Load environment variables
const RapidAPIKey = validateEnv_1.default.RAPIDAPI_KEY;
app.use('/api/auth', authRoutes_1.default);
app.use('/api/prices', auth_1.requireAuth, priceRoutes_1.default);
app.use('/api/', auth_1.requireAuth, userRoutes_1.default);
// For unidentified endpoints
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, 'Endpoint not found'));
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error, req, res, next) => {
    let errorMessage = 'an unknown error occurred';
    let statuscode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statuscode = error.status;
        errorMessage = error.message;
    }
    //console.error('Test Error:', error);
    res.status(statuscode).json({ error: errorMessage });
});
app.post('/hi', (req, res) => {
    const { state, suburb, zip, bedrooms, bathrooms, garage, priceMin, priceMax, areaMin, areaMax } = req.body;
    console.log('Hello, we get ' + state);
    res.send(JSON.stringify(req.body));
});
app.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const suggesstions = {
        method: 'GET',
        url: 'https://realty-in-au.p.rapidapi.com/auto-complete',
        params: { query: query },
        headers: {
            'X-RapidAPI-Key': RapidAPIKey,
            'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com',
        },
    };
    let searchLocation;
    let searchLocationSubtext;
    let type;
    try {
        const response = yield axios_1.default.request(suggesstions);
        const suggesstion = response.data.suggesstions[0];
        searchLocation = suggesstion.display.text;
        searchLocationSubtext = suggesstion.display.subtext;
        type = suggesstion.type;
    }
    catch (error) {
        console.error(error);
    }
    const channel = req.query.channel;
    const sort = req.query.sort;
    const options = {
        method: 'GET',
        url: 'https://realty-in-au.p.rapidapi.com/properties/list',
        params: {
            channel: channel || 'buy',
            searchLocation: searchLocation,
            searchLocationSubtext: searchLocationSubtext,
            type: type,
            page: '1',
            pageSize: '50',
            sortType: sort || 'relevance',
            surroundingSuburbs: 'true',
            'ex-under-contract': 'false',
        },
        headers: {
            'X-RapidAPI-Key': RapidAPIKey,
            'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com',
        },
    };
    try {
        const response = yield axios_1.default.request(options);
        const results = response.data.tieredResults[0].results;
        const prices = results.map((result) => ({
            address: `${result.address.streetAddress} ${result.address.suburb} ${result.address.postcode}`,
            price: (0, priceProcessing_1.default)(result.price.display),
        }));
        res.json(prices);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
}));
exports.default = app;
