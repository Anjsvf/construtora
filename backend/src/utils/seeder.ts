import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';
import { connectDB } from '../config/db';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    // Clear database (optional, be careful!)
    // await User.deleteMany({});
    // console.log('Data cleared...');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@construtora.com' });
    
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@construtora.com',
        password: 'admin123', // Should be changed immediately after first login
        isAdmin: true,
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seeding completed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedDatabase(); 