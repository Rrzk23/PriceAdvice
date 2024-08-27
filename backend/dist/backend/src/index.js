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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const priceRoutes_1 = __importDefault(require("./routes/priceRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const priceProcessing_1 = __importDefault(require("./priceProcessing"));
// Initialize environment variables
dotenv_1.default.config();
// Create an Express application
const app = (0, express_1.default)();
// Load environment variables
const RapidAPIKey = process.env.RAPIDAPI_KEY;
const PORT = parseInt(process.env.PORT || '5000', 10);
// Apply middleware
app.use(express_1.default.json());
//const corsOptions = {
//  origin: 'http://localhost:3000',  // 只允许这个来源的请求
//  optionsSuccessStatus: 200
//};
//app.use(cors(corsOptions));
app.use(express_1.default.json());
app.post('/hi', (req, res) => {
    const { state, suburb, zip, bedrooms, bathrooms, garage, priceMin, priceMax, areaMin, areaMax } = req.body;
    console.log("Hello, we get " + state);
    res.send(JSON.stringify(req.body));
});
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
// channel REQUIRED One of the following : buy|rent|sold
//searchLocation REQUIRED The value of text field returned in …/auto-complete endpoint
// searchLocationSubtext The value of subtext field returned in …/auto-complete endpoint
// type REQUIRED The value of region field returned in …/auto-complete endpoint
// sort One of the following relevance|new-asc|new-desc|price-asc|price-desc
// propertyTypes Ignore or one of the following : townhouse|unit apartment|retire|acreage|land|unitblock|house|villa|rural. Separated by comma for multiple options. Ex : townhouse,house,villa
app.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    res.send('Hello there, ' + req);
    const query = req.query;
    const suggesstions = {
        method: 'GET',
        url: 'https://realty-in-au.p.rapidapi.com/auto-complete',
        params: { query: query },
        headers: {
            'X-RapidAPI-Key': RapidAPIKey,
            'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com'
        }
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
        console.log(response.data);
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
            channel: 'buy',
            searchLocation: searchLocation,
            searchLocationSubtext: searchLocationSubtext,
            type: type,
            page: '1',
            pageSize: '50',
            sortType: 'relevance',
            surroundingSuburbs: 'true',
            'ex-under-contract': 'false'
        },
        headers: {
            // Use the corrected variable name here
            'X-RapidAPI-Key': RapidAPIKey,
            'X-RapidAPI-Host': 'realty-in-au.p.rapidapi.com'
        }
    };
    try {
        const response = yield axios_1.default.request(options);
        console.log('Start');
        const results = response.data.tieredResults[0].results;
        let i = 1;
        const prices = results.map((result) => ({
            address: `${result.address.streetAddress} ${result.address.suburb} ${result.address.postcode}`,
            price: (0, priceProcessing_1.default)(result.price.display)
        }));
        console.log(prices);
        console.log('end');
    }
    catch (error) {
        console.error(error);
    }
}));
app.use('/api/prices', priceRoutes_1.default);
app.use('/api/login', authRoutes_1.default);
app.use('/api/', userRoutes_1.default);
