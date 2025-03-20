import { Router } from 'express';

const healthRouter = Router();

/**
 * @route GET /health
 * @desc Check if the API is running
 * @access Public
 */
healthRouter.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter; 