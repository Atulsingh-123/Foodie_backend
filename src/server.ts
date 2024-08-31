import http from 'http';
import { Server } from 'socket.io';
import { app, setSocketServerInstance } from './App'; 

const server = http.createServer(app);

const io = new Server(server, {
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
    } else {
      console.error('Invalid orderDetails received:', orderDetails);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Make io accessible from other modules
setSocketServerInstance(io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
