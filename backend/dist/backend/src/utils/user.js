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
exports.saveUsers = exports.updateUser = exports.searchUserbyEmail = exports.readUsers = void 0;
const fs_1 = __importDefault(require("fs"));
const databsePath = '../../models/databse.json';
//read the users
const readUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = [];
    return users;
});
exports.readUsers = readUsers;
//search and return the users by checking the email
const searchUserbyEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const dataString = yield fs_1.default.readFileSync(databsePath, 'utf-8');
    const users = JSON.parse(dataString);
    const user = users.find((target) => target.email === email);
    return user;
});
exports.searchUserbyEmail = searchUserbyEmail;
// update the user 
const updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const curUser = yield (0, exports.searchUserbyEmail)(user.email);
    if (curUser) {
        //update in the database
    }
    else {
        console.log('User not found');
        return;
    }
});
exports.updateUser = updateUser;
const saveUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonData = JSON.stringify(users, null, 2);
    yield fs_1.default.promises.writeFile('databsePath', jsonData);
});
exports.saveUsers = saveUsers;
//export const generateUserId = async; 
