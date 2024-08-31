import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import foodDishRoutes from './routes/fooddishRoutes';
import authRoutes from './routes/authRoutes';
import { connectDB } from './config/db';
import uploadRoutes from './routes/uploadRoutes';

const app = express();
let io: any; // This will hold the io instance

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Initialize and connect to the database
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database

    // Register routes after the database connection is established
    app.use('/api/orders', orderRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/food-dishes', foodDishRoutes);
    app.use('/api', uploadRoutes);
    app.use('/api/auth', authRoutes);

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

    ioInstance.on('connection', (socket: any) => {
      console.log('A user connected');

      socket.on('orderConfirmation', (orderDetails: any) => {
        console.log('Order confirmed:', orderDetails);
        ioInstance.emit('orderUpdate', `Order confirmed with ID: ${orderDetails.tableNumber}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });

    // Set the Socket.io instance globally
    setSocketServerInstance(ioInstance);

  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Function to set the Socket.io server instance
const setSocketServerInstance = (ioInstance: any) => {
  io = ioInstance;
};

// Function to get the Socket.io server instance
const getSocketServerInstance = () => {
  if (!io) {
    throw new Error('Socket.io instance is not set');
  }
  return io;
};

export { app, setSocketServerInstance, getSocketServerInstance, io };

// Start the server
startServer();
