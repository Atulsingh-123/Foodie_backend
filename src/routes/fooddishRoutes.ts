import { Router } from 'express';
import { createFoodDish, getFoodDishes } from '../controllers/foodDishController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Apply the authenticateToken middleware to routes that need protection
router.post('/upload', createFoodDish);
router.post('/create', authenticateToken, createFoodDish);
router.get('/getdata', authenticateToken, getFoodDishes);

export default router;
