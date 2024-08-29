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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_1 = require("../utils/user");
const genToken_1 = require("../utils/genToken");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //let id : string = generateUserId();
    const user = {
        id: 1,
        name: "abc",
        email: req.body.email,
        password: req.body.password,
        token: 'abc123',
    };
    res.json(user);
    res.send();
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_1.searchUserbyEmail)(req.body.email);
    if (!user || user.password !== req.body.password) {
        throw res.status(401).json({ message: 'Incorrect email or password' });
    }
    const token = (0, genToken_1.generateToken)(user);
    user.token = token;
    // Save the user back to the database, if necessary
    yield (0, user_1.updateUser)(user);
    res.json(Object.assign(Object.assign({}, user), { token: 'abc123' }));
    res.send();
});
exports.loginUser = loginUser;
