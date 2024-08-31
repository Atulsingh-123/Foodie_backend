import { Server } from 'socket.io';

// Create a reference to the Socket.IO server instance
let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
};

export const sendNotification = async (message: string, data?: any) => {
  if (!io) {
    throw new Error('Socket.IO server not initialized');
  }

  // Broadcast message and data to all connected clients
  io.emit('order-confirmed', {
    message,
    data,
  });
};
