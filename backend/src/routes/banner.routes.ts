import express from 'express';
import { 
  getActiveBanner, 
  getAllBanners, 
  uploadBanner, 
  updateBannerStatus, 
  deleteBanner 
} from '../controllers/banner.controller';
import { protect, admin } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';
import { optimizeImage } from '../middleware/image.middleware';

const router = express.Router();

// Public routes
router.get('/', getActiveBanner as any);

// Admin routes
router.get('/all', protect, admin, getAllBanners as any);
router.post('/', protect, admin, upload.single('image'), optimizeImage, uploadBanner as any);
router.put('/:id', protect, admin, updateBannerStatus as any);
router.delete('/:id', protect, admin, deleteBanner as any);

// Rota de teste para upload (sem autenticação - apenas para debug)
router.post('/test-upload', upload.single('image'), optimizeImage, (req, res) => {
  try {
    console.log('Teste de upload recebido');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const file = req.file;
    if (!file) {
      console.log('Nenhum arquivo encontrado na requisição');
      return res.status(400).json({ message: 'Please upload an image' });
    }
    
    console.log('Arquivo recebido (convertido para WebP):', {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`
    });
    
    res.status(200).json({ 
      message: 'Upload bem sucedido e convertido para WebP!',
      filename: file.filename,
      path: `/uploads/${file.filename}`
    });
  } catch (error) {
    console.error('Erro no teste de upload:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

export default router; 