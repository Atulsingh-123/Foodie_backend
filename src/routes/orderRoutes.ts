import express from 'express';
import { io } from '../App'; // Adjust the import path as needed
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/confirm',authenticateToken, (req, res) => {
  const { tableNumber, items, total } = req.body;

  // Emit order notification
  io.emit('orderUpdate', { tableNumber, items, total });

  res.status(200).json({ message: 'Order confirmed' });
});

export default router;
