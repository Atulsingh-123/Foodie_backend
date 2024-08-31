"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    //   orderId: { type: Schema.Types.ObjectId, required: true, ref: 'Order' }, 
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    currency: { type: String, required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Payment', paymentSchema);
