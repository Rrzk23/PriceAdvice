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
exports.startServer = void 0;
require("dotenv/config.js");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
// Load environment variables
const PORT = validateEnv_1.default.PORT;
// Function to start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connect(validateEnv_1.default.DB_URL).then(() => {
        console.log('Connected to database');
        app_1.default.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    }).catch(console.error);
});
exports.startServer = startServer;
// Start the server in production environment
if (process.env.NODE_ENV !== 'test') {
    (0, exports.startServer)().catch(console.error);
}
