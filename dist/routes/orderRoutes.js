"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const App_1 = require("../App"); // Adjust the import path as needed
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/confirm', authMiddleware_1.authenticateToken, (req, res) => {
    const { tableNumber, items, total } = req.body;
    // Emit order notification
    App_1.io.emit('orderUpdate', { tableNumber, items, total });
    res.status(200).json({ message: 'Order confirmed' });
});
exports.default = router;
