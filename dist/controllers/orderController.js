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
exports.confirmOrder = void 0;
const App_1 = require("../App");
const orderModel_1 = require("../models/orderModel");
const confirmOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tableNumber, items, total } = req.body;
    if (!tableNumber || !Array.isArray(items) || typeof total !== 'number') {
        return res.status(400).json({ message: 'Invalid request data' });
    }
    const orderConfirmation = {
        tableNumber,
        items,
        total,
        timestamp: new Date(),
    };
    try {
        // Store the order in the database
        const newOrder = new orderModel_1.OrderModel(orderConfirmation);
        yield newOrder.save();
        // Emit the order to all connected clients
        const io = (0, App_1.getSocketServerInstance)();
        io.emit('orderConfirmation', orderConfirmation);
        // Return the order ID and any necessary details to the frontend
        res.status(200).json({
            message: 'Order confirmed',
            orderId: newOrder._id, // Assuming MongoDB auto-generates _id
            totalAmount: total
        });
    }
    catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ message: 'Error confirming order' });
    }
});
exports.confirmOrder = confirmOrder;
