import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { createInitialAdminUser } from './controllers/auth.controller';

// Import routes
import authRoutes from './routes/auth.routes';
import bannerRoutes from './routes/banner.routes';
import projectsRoutes from './routes/projects.routes';
import healthRouter from './routes/health.routes';

import errorHandler from './middleware/error.middleware';
import { protect } from './middleware/auth.middleware';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    // Create initial admin user after DB connection
    createInitialAdminUser();
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://construtora-yjlw.onrender.com', 'https://construtora-7qms.onrender.com'], // Permite ambos os endereços do frontend
  credentials: true
}));
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Permite recursos de diferentes origens
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Servindo arquivos estáticos de:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/banner', bannerRoutes);

app.use('/health', healthRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Construtora API is running...');
});

// Rota de teste
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API está funcionando!' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});