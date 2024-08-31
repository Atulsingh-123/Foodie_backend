"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const App_1 = require("./App");
const server = http_1.default.createServer(App_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow your frontend origin
        methods: ['GET', 'POST'],
    },
});
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('orderConfirmation', (orderDetails) => {
        console.log('Received orderDetails:', orderDetails); // Debugging line
        if (orderDetails && orderDetails.tableNumber && orderDetails.items && orderDetails.total) {
            console.log('Order confirmed:', orderDetails);
            io.emit('orderNotification', orderDetails);
        }
        else {
            console.error('Invalid orderDetails received:', orderDetails);
        }
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Make io accessible from other modules
(0, App_1.setSocketServerInstance)(io);
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
