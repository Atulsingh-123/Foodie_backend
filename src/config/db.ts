import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI||"mongodb+srv://aksinghak471947:Atul123456@cluster0.c40en.mongodb.net/fodiee?retryWrites=true&w=majority"
console.log(uri);

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully with Mongoose');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); 
  }
};
