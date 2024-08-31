import { Request, Response } from 'express';
import { getSocketServerInstance } from '../App';
import { OrderModel } from '../models/orderModel'

export const confirmOrder = async (req: Request, res: Response) => {
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
    const newOrder = new OrderModel(orderConfirmation);
    await newOrder.save();

    // Emit the order to all connected clients
    const io = getSocketServerInstance();
    io.emit('orderConfirmation', orderConfirmation);

    // Return the order ID and any necessary details to the frontend
    res.status(200).json({ 
      message: 'Order confirmed', 
      orderId: newOrder._id,  // Assuming MongoDB auto-generates _id
      totalAmount: total 
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ message: 'Error confirming order' });
  }
};
