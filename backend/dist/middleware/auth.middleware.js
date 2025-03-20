"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    console.log('Verificando autenticação...');
    console.log('Headers:', req.headers);
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            console.log('Token encontrado:', token.substring(0, 10) + '...');
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'defaultsecret');
            console.log('Token decodificado:', decoded);
            // Get user from the token
            req.user = await User_1.default.findById(decoded.id).select('-password');
            console.log('Usuário encontrado:', req.user ? req.user._id : 'não encontrado');
            next();
        }
        catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        console.log('Nenhum token encontrado no cabeçalho Authorization');
        if (!token) {
            res.status(401).json({ message: 'Not authorized, no token provided' });
        }
    }
};
exports.protect = protect;
// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
exports.admin = admin;
