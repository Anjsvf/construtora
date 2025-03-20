import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';


interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as any;
      console.log('Token decodificado:', decoded);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Usuário encontrado:', req.user ? req.user._id : 'não encontrado');

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('Nenhum token encontrado no cabeçalho Authorization');
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  }
};

// Admin middleware
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
}; 