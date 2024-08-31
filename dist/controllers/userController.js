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
exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const JWT_SECRET = process.env.JWT_SECRET || "u3387y38whdwjeu832y8e32ej2e23he";
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        if (typeof password !== 'string' || typeof 10 !== 'number') {
            throw new Error('Invalid input types for bcrypt');
        }
        // Check if user already exists
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        console.log("Hashed Password:", hashedPassword);
        // Create a new user
        const newUser = new user_1.default({ name, email, password: hashedPassword });
        console.log("New User:", newUser);
        // Save the new user to the database
        yield newUser.save();
        // Create a JWT token
        const token = jsonwebtoken_1.default.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
        // Respond with the new user and token
        res.status(201).json({ success: true, result: newUser, token, message: 'Registration successful!' });
    }
    catch (error) {
        console.error('Signup Error:', error); // Log the error details for debugging
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User doesn\'t exist' });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, result: existingUser, token, message: 'Login successful!' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});
exports.signin = signin;
