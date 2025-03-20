import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  updateProjectStatus,
  updateProjectDate
} from '../controllers/project.controller';
import { protect, admin } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';
import { optimizeImage } from '../middleware/image.middleware';

const router = express.Router();

// Public routes
router.get('/', getProjects as any);
router.get('/:id', getProjectById as any);

// Admin routes
router.post('/', protect, admin, upload.single('image'), optimizeImage, createProject as any);
router.put('/:id', protect, admin, upload.single('image'), optimizeImage, updateProject as any);
router.delete('/:id', protect, admin, deleteProject as any);
router.patch('/:id/status', protect, admin, updateProjectStatus as any);
router.patch('/:id/update-date', protect, admin, updateProjectDate as any);

export default router; 