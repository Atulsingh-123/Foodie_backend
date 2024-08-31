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
exports.verifyPayment = exports.createOrder = void 0;
// src/controllers/paymentController.ts
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_263aDscprof7Go',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'Neq0zT98fBeMOVNueEKd4LEt',
});
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency } = req.body;
        const options = {
            amount: amount * 100, // amount in the smallest currency unit
            currency: currency || 'INR',
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
        };
        const order = yield razorpay.orders.create(options);
        if (!order) {
            return res.status(500).json({ message: 'Failed to create order' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const hmac = crypto_1.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_SECRET');
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    if (generated_signature === razorpay_signature) {
        res.status(200).json({ message: 'Payment verified successfully' });
    }
    else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};
exports.verifyPayment = verifyPayment;
