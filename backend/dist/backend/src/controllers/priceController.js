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
exports.deletePrice = exports.updatePrice = exports.postPrice = exports.getPrice = exports.getPrices = exports.getRealTimePrices = exports.getFilteredPrices = void 0;
const priceModel_1 = __importDefault(require("../../models/priceModel"));
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
// Define a Zod schema for FilterSetting
const FilterSettingSchema = zod_1.z.object({
    location: zod_1.z.string(),
    minPrice: zod_1.z.number(),
    maxPrice: zod_1.z.number(),
    propertyType: zod_1.z.string(),
});
// Define a Zod schema for Price
const PriceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    location: zod_1.z.string(),
    price: zod_1.z.number(),
    date: zod_1.z.string(),
});
const PricesArraySchema = zod_1.z.array(PriceSchema);
// Controller function to get filtered prices
const getFilteredPrices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.body;
        FilterSettingSchema.parse(filters); // Validate filter settings
        // Replace with the actual API call and logic to use the filters
        const response = yield axios_1.default.get('https://example.com/api/prices', {
            params: filters,
        });
        //const prices: Price[] = response.data;
        //PricesArraySchema.parse(prices); // Validate the response data
        //res.json(prices);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching filtered prices', error });
    }
});
exports.getFilteredPrices = getFilteredPrices;
const getRealTimePrices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getRealTimePrices = getRealTimePrices;
const getPrices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //throw Error('Server error');
        const price = yield priceModel_1.default.find().exec();
        res.status(200).json(price);
    }
    catch (error) {
        //middleware  
        next(error);
    }
});
exports.getPrices = getPrices;
const getPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const priceId = req.params.priceId;
    try {
        if (!mongoose_1.default.isValidObjectId(priceId)) {
            throw (0, http_errors_1.default)(400, 'Invalid price id');
        }
        const price = yield priceModel_1.default.findById(priceId).exec();
        if (!price) {
            throw (0, http_errors_1.default)(404, 'Price not found');
        }
        res.status(200).json(price);
    }
    catch (error) {
        next(error);
    }
});
exports.getPrice = getPrice;
const postPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const location = req.body.location;
    const price = req.body.price;
    const date = req.body.date;
    try {
        if (!location || !price || !date) {
            throw (0, http_errors_1.default)(400, 'Posting price requires a location, price and date');
        }
        const newPrice = yield priceModel_1.default.create({
            location: location,
            price: price,
            date: date,
        });
        //await newPrice.save();
        // new resource created.
        res.status(201).json(newPrice);
    }
    catch (error) {
        next(error);
    }
});
exports.postPrice = postPrice;
const updatePrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const priceId = req.params.priceId;
    const newLocation = req.body.location;
    const newPrice = req.body.price;
    const newDate = req.body.date;
    try {
        if (!mongoose_1.default.isValidObjectId(priceId)) {
            throw (0, http_errors_1.default)(400, 'Invalid price id');
        }
        if (!newLocation) {
            throw (0, http_errors_1.default)(400, 'Updating price missing a location');
        }
        if (!newPrice) {
            throw (0, http_errors_1.default)(400, 'Updating price missing a price');
        }
        if (!newDate) {
            throw (0, http_errors_1.default)(400, 'Updating price missing a date');
        }
        const price = yield priceModel_1.default.findById(priceId).exec();
        if (!price) {
            throw (0, http_errors_1.default)(404, 'Price not found');
        }
        price.location = newLocation;
        price.price = newPrice;
        price.date = newDate;
        const updatedPrice = yield price.save();
        res.status(200).json(updatedPrice);
    }
    catch (error) {
        next(error);
    }
});
exports.updatePrice = updatePrice;
const deletePrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const priceId = req.params.priceId;
    try {
        if (!mongoose_1.default.isValidObjectId(priceId)) {
            throw (0, http_errors_1.default)(400, 'Invalid price id');
        }
        const price = yield priceModel_1.default.findById(priceId).exec();
        if (!price) {
            throw (0, http_errors_1.default)(404, 'Price not found');
        }
        yield priceModel_1.default.findByIdAndDelete(priceId).exec();
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
});
exports.deletePrice = deletePrice;
