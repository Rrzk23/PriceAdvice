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
exports.getRealTimePrices = exports.getFilteredPrices = void 0;
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
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
        const prices = response.data;
        PricesArraySchema.parse(prices); // Validate the response data
        res.json(prices);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching filtered prices', error });
    }
});
exports.getFilteredPrices = getFilteredPrices;
const getRealTimePrices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.getRealTimePrices = getRealTimePrices;
