import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/user';


const JWT_SECRET = process.env.JWT_SECRET || "u3387y38whdwjeu832y8e32ej2e23he";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (typeof password !== 'string' || typeof 10 !== 'number') {
      throw new Error('Invalid input types for bcrypt');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({success:false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    console.log("New User:", newUser);

    // Save the new user to the database
    await newUser.save();

    // Create a JWT token
    const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with the new user and token
    res.status(201).json({success: true, result: newUser, token ,message: 'Registration successful!'});
  } catch (error) {
    console.error('Signup Error:', error); // Log the error details for debugging
    res.status(500).json({success:false, message: 'Something went wrong' });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({success:false, message: 'User doesn\'t exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({success:false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: existingUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, result: existingUser, token, message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({success:false, message: 'Something went wrong' });
  }
};
