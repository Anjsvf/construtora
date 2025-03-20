import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Banner, { IBanner } from '../models/Banner';

// @desc    Get active banner
// @route   GET /api/banner
// @access  Public
export const getActiveBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!banner) {
      return res.status(404).json({ message: 'No active banner found' });
    }
    
    res.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all banners
// @route   GET /api/banner/all
// @access  Private/Admin
export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload a new banner
// @route   POST /api/banner
// @access  Private/Admin
export const uploadBanner = async (req: Request, res: Response) => {
  try {
    console.log('Requisição de upload recebida');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Files:', req.file);
    
    const file = req.file;

    if (!file) {
      console.log('Nenhum arquivo encontrado na requisição');
      return res.status(400).json({ message: 'Please upload an image' });
    }

    console.log('Arquivo recebido:', {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Set all existing banners to inactive
    await Banner.updateMany({}, { isActive: false });

    // Create new active banner
    const banner = await Banner.create({
      image: `/uploads/${file.filename}`,
      isActive: true,
    });

    console.log('Banner criado:', banner);
    res.status(201).json(banner);
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update banner status (activate/deactivate)
// @route   PUT /api/banner/:id
// @access  Private/Admin
export const updateBannerStatus = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;
    
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    if (isActive) {
      // If activating this banner, deactivate all others
      await Banner.updateMany({ _id: { $ne: banner._id } }, { isActive: false });
    }
    
    banner.isActive = isActive;
    const updatedBanner = await banner.save();
    
    res.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banner/:id
// @access  Private/Admin
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    // Delete the image file if it exists
    if (banner.image) {
      const imagePath = path.join(__dirname, '../../', banner.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await banner.deleteOne();
    
    // If this was the active banner and there are other banners, 
    // make the most recent one active
    if (banner.isActive) {
      const newestBanner = await Banner.findOne().sort({ createdAt: -1 });
      if (newestBanner) {
        newestBanner.isActive = true;
        await newestBanner.save();
      }
    }
    
    res.json({ message: 'Banner removed' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 