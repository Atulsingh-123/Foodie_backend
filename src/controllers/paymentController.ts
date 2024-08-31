// src/controllers/paymentController.ts
import Razorpay from 'razorpay';
import { Request, Response } from 'express';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_263aDscprof7Go',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'Neq0zT98fBeMOVNueEKd4LEt',
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: currency || 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: 'Failed to create order' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const verifyPayment = (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_SECRET');
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid signature' });
  }
};
