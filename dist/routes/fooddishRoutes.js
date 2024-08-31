"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const foodDishController_1 = require("../controllers/foodDishController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Apply the authenticateToken middleware to routes that need protection
router.post('/upload', foodDishController_1.createFoodDish);
router.post('/create', authMiddleware_1.authenticateToken, foodDishController_1.createFoodDish);
router.get('/getdata', authMiddleware_1.authenticateToken, foodDishController_1.getFoodDishes);
exports.default = router;
