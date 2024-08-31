import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
//   orderId: { type: Schema.Types.ObjectId, required: true, ref: 'Order' }, 
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  currency: { type: String, required: true }
}, { timestamps: true });

export default model('Payment', paymentSchema);
