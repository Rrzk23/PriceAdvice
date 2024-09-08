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
exports.logoutUser = exports.loginUser = exports.signUpUser = exports.getAuthenticatedUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const userModel_1 = __importDefault(require("../../models/userModel"));
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.session.userId;
    try {
        const user = yield userModel_1.default
            .findById(authenticatedUserId)
            .select('+email')
            .exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const signUpUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.username;
    const userEmail = req.body.email;
    const passwordRaw = req.body.password;
    try {
        if (!userName || !userEmail || !passwordRaw) {
            throw (0, http_errors_1.default)(400, 'User name, email or password missing');
        }
        // Validate email format
        const existingUserName = yield userModel_1.default.findOne({ username: userName }).exec();
        if (existingUserName) {
            throw (0, http_errors_1.default)(409, 'User name already taken');
        }
        const existingUserEmail = yield userModel_1.default.findOne({ email: userEmail }).exec();
        if (existingUserEmail) {
            throw (0, http_errors_1.default)(409, 'Email already in use');
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(passwordRaw, 10);
        // Create new user
        const newUser = yield userModel_1.default.create({
            username: userName,
            email: userEmail,
            password: hashedPassword,
        });
        //await newUser.save();
        req.session.userId = newUser._id;
        res.status(201).json(newUser);
        // start session
    }
    catch (error) {
        next(error);
    }
});
exports.signUpUser = signUpUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userNameOrEmail = req.body.userNameOrEmail;
    const passwordRaw = req.body.password;
    try {
        if (!userNameOrEmail || !passwordRaw) {
            throw (0, http_errors_1.default)(400, 'User name or email or password missing');
        }
        const user = yield userModel_1.default
            .findOne({ $or: [{ username: userNameOrEmail }, { email: userNameOrEmail }] })
            .select('+password +email +username')
            .exec();
        if (!user) {
            throw (0, http_errors_1.default)(404, 'User not found');
        }
        const isPasswordValid = yield bcrypt_1.default.compare(passwordRaw, user.password);
        if (!isPasswordValid) {
            throw (0, http_errors_1.default)(401, 'Invalid password');
        }
        req.session.userId = user._id;
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        else {
            res.status(200).json({ message: 'Logged out' });
        }
    });
};
exports.logoutUser = logoutUser;
