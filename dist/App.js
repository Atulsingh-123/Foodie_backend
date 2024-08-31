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
exports.io = exports.getSocketServerInstance = exports.setSocketServerInstance = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const fooddishRoutes_1 = __importDefault(require("./routes/fooddishRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = require("./config/db");
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const app = (0, express_1.default)();
exports.app = app;
let io; // This will hold the io instance
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
// Initialize and connect to the database
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.connectDB)(); // Connect to the database
        // Register routes after the database connection is established
        app.use('/api/orders', orderRoutes_1.default);
        app.use('/api/payments', paymentRoutes_1.default);
        app.use('/api/food-dishes', fooddishRoutes_1.default);
        app.use('/api', uploadRoutes_1.default);
        app.use('/api/auth', authRoutes_1.default);
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        // Initialize Socket.io with the server instance
        const { Server } = require('socket.io');
        const ioInstance = new Server(server, {
            cors: {
                origin: 'http://localhost:5173', // Your frontend origin
                methods: ['GET', 'POST']
            }
        });
        ioInstance.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('orderConfirmation', (orderDetails) => {
                console.log('Order confirmed:', orderDetails);
                ioInstance.emit('orderUpdate', `Order confirmed with ID: ${orderDetails.tableNumber}`);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
        // Set the Socket.io instance globally
        setSocketServerInstance(ioInstance);
    }
    catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exit the process if the database connection fails
    }
});
// Function to set the Socket.io server instance
const setSocketServerInstance = (ioInstance) => {
    exports.io = io = ioInstance;
};
exports.setSocketServerInstance = setSocketServerInstance;
// Function to get the Socket.io server instance
const getSocketServerInstance = () => {
    if (!io) {
        throw new Error('Socket.io instance is not set');
    }
    return io;
};
exports.getSocketServerInstance = getSocketServerInstance;
// Start the server
startServer();
