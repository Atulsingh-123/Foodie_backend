import mongoose, { Schema, Document } from 'mongoose';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order extends Document {
  tableNumber: number;
  items: OrderItem[];
  total: number;
  timestamp: Date;
}

const OrderSchema: Schema = new Schema({
  tableNumber: { type: Number, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const OrderModel = mongoose.model<Order>('Order', OrderSchema);
