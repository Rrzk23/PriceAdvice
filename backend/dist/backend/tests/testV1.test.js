"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const priceProcessing_1 = __importDefault(require("../src/priceProcessing")); // Adjust the path as necessary
const globals_1 = require("@jest/globals");
(0, globals_1.describe)('normalizePrice', () => {
    (0, globals_1.test)('handles single prices with dollar sign', () => {
        (0, globals_1.expect)((0, priceProcessing_1.default)('$500,000')).toBe(500000);
    });
    (0, globals_1.test)('handles single prices without dollar sign', () => {
        (0, globals_1.expect)((0, priceProcessing_1.default)('500,000')).toBe(500000);
    });
    (0, globals_1.test)('handles price ranges with "to"', () => {
        (0, globals_1.expect)((0, priceProcessing_1.default)('$400,000 to $450,000')).toBe(425000);
    });
    (0, globals_1.test)('handles price ranges with "-"', () => {
        (0, globals_1.expect)((0, priceProcessing_1.default)('$400,000 - $450,000')).toBe(425000);
    });
    (0, globals_1.test)('handles price ranges with "-" (no spaces)', () => {
        (0, globals_1.expect)((0, priceProcessing_1.default)('$400,000-$450,000')).toBe(425000);
    });
    (0, globals_1.test)('returns "Auction" for auction prices', () => {
        (0, globals_1.expect)((0, priceProcessing_1.default)('Auction')).toBe('Auction');
    });
    (0, globals_1.test)('returns "N/A" for undefined prices', () => {
        (0, globals_1.expect)((0, priceProcessing_1.default)('')).toBe('Not Price or Auction available.');
    });
    // Add more test cases as needed
});
