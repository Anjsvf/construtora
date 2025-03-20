import express from 'express';
import { login, register, getUserProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', register as any);
router.post('/login', login as any);

// Protected routes
router.get('/profile', protect, getUserProfile as any);

export default router; 