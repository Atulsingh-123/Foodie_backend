import { Request, Response } from 'express';
import FoodDish from '../models/fooddish';

export const createFoodDish = async (req: Request, res: Response): Promise<void> => {
  const { name, price, description, category, imageUrl } = req.body;

  try {
    const newFoodDish = new FoodDish({
      name,
      price,
      description,
      category,
      imageUrl,
    });

    const savedFoodDish = await newFoodDish.save();
    res.status(201).json({message: 'Added one food in list',savedFoodDish});
  } catch (error) {
    res.status(500).json({ message: 'Error creating food dish', error });
  }
};

// Get all food dishes
export const getFoodDishes = async (req: Request, res: Response): Promise<void> => {
  try {
    const foodDishes = await FoodDish.find();
    res.status(200).json(foodDishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food dishes', error });
  }
};
