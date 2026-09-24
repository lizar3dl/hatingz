import type { Request, Response, NextFunction } from 'express';
import { loginUser, registerUser } from '../services/authService';

export async function registerController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
