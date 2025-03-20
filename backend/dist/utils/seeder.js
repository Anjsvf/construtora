"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const db_1 = require("../config/db");
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
const seedDatabase = async () => {
    try {
        await (0, db_1.connectDB)();
        console.log('Connected to MongoDB...');
        // Clear database (optional, be careful!)
        // await User.deleteMany({});
        // console.log('Data cleared...');
        // Create admin user if it doesn't exist
        const adminExists = await User_1.default.findOne({ email: 'admin@construtora.com' });
        if (!adminExists) {
            await User_1.default.create({
                username: 'admin',
                email: 'admin@construtora.com',
                password: 'admin123', // Should be changed immediately after first login
                isAdmin: true,
            });
            console.log('Admin user created');
        }
        else {
            console.log('Admin user already exists');
        }
        console.log('Seeding completed!');
        process.exit();
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};
seedDatabase();
