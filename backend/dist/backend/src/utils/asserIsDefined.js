"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsDefined = void 0;
function assertIsDefined(value) {
    if (value === null || value === undefined) {
        throw new Error("Expected 'val' to be null or undefined");
    }
}
exports.assertIsDefined = assertIsDefined;
