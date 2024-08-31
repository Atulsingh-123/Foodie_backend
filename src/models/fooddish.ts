import { Schema, model } from 'mongoose';

const foodDishSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true }
})
// { timestamps: true });

export default model('FoodDish', foodDishSchema);
