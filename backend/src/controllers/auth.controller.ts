import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      isAdmin: false, // Default to non-admin for security
    }) as IUser & { _id: mongoose.Types.ObjectId };

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }) as IUser & { _id: mongoose.Types.ObjectId };

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create initial admin user if none exists
// @route   Called on server startup
// @access  Private
export const createInitialAdminUser = async () => {
  try {
    // Check if any admin user exists
    const adminExists = await User.findOne({ isAdmin: true });

    if (!adminExists) {
      // Get admin credentials from environment variables or use secure defaults
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      
      // Use a strong random password if not provided in env variables
      const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 
                           (Math.random().toString(36).slice(2) + 
                            Math.random().toString(36).toUpperCase().slice(2));
      
      // Create default admin user
      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        isAdmin: true,
      });
      
      // Log that admin was created but don't log the credentials
      console.log('🔐 Initial admin user created');
      console.log(`Username: ${adminUsername}`);
      console.log(`Email: ${adminEmail}`);
      
      // Only log password in development environment for first-time setup
      if (process.env.NODE_ENV === 'development' && !process.env.ADMIN_INITIAL_PASSWORD) {
        console.log('----------------------------------------');
        console.log('⚠️ IMPORTANT: SECURE YOUR ADMIN ACCOUNT ⚠️');
        console.log('----------------------------------------');
        console.log(`Generated temporary password: ${adminPassword}`);
        console.log('Please change this password immediately after logging in!');
        console.log('For production, set ADMIN_INITIAL_PASSWORD in your environment variables.');
        console.log('----------------------------------------');
      }
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
}; 