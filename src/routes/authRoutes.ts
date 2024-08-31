// authRoutes.ts (using default export)
import express from 'express';
import { signin, signup } from '../controllers/userController';


const router = express.Router();

router.post('/register', signup);
router.post('/login', signin);

export default router; // Default export
