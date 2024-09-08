"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_js_1 = require("envalid/dist/validators.js");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    DB_URL: (0, validators_js_1.str)(),
    PORT: (0, validators_js_1.port)(),
    RAPIDAPI_KEY: (0, validators_js_1.str)(),
    SESSION_SECRET: (0, validators_js_1.str)(),
    NODE_ENV: (0, validators_js_1.str)(),
});
