"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_js_1 = require("envalid/dist/validators.js");
const validateEnv = () => {
    if (process.env.CI === 'true') {
        console.log('Running in CI environment, skipping strict validation');
        return {
            DB_URL: 'mongodb+srv://mock:QNsZWok9HjBTYdly@cluster0.rxrjtdf.mongodb.net/cool_price_app?retryWrites=true&w=majority&appName=Cluster0',
            PORT: 3000,
            RAPIDAPI_KEY: 'mock_api_key',
            SESSION_SECRET: 'mock_session_secret',
            NODE_ENV: 'test',
        };
    }
    return (0, envalid_1.cleanEnv)(process.env, {
        DB_URL: (0, validators_js_1.str)(),
        PORT: (0, validators_js_1.port)(),
        RAPIDAPI_KEY: (0, validators_js_1.str)(),
        SESSION_SECRET: (0, validators_js_1.str)(),
        NODE_ENV: (0, validators_js_1.str)(),
    });
};
exports.default = validateEnv();
