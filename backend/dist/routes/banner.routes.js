"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const banner_controller_1 = require("../controllers/banner.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const image_middleware_1 = require("../middleware/image.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', banner_controller_1.getActiveBanner);
// Admin routes
router.get('/all', auth_middleware_1.protect, auth_middleware_1.admin, banner_controller_1.getAllBanners);
router.post('/', auth_middleware_1.protect, auth_middleware_1.admin, upload_middleware_1.default.single('image'), image_middleware_1.optimizeImage, banner_controller_1.uploadBanner);
router.put('/:id', auth_middleware_1.protect, auth_middleware_1.admin, banner_controller_1.updateBannerStatus);
router.delete('/:id', auth_middleware_1.protect, auth_middleware_1.admin, banner_controller_1.deleteBanner);
// Rota de teste para upload (sem autenticação - apenas para debug)
router.post('/test-upload', upload_middleware_1.default.single('image'), image_middleware_1.optimizeImage, (req, res) => {
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
    }
    catch (error) {
        console.error('Erro no teste de upload:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});
exports.default = router;
