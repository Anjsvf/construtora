"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const image_middleware_1 = require("../middleware/image.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', project_controller_1.getProjects);
router.get('/:id', project_controller_1.getProjectById);
// Admin routes
router.post('/', auth_middleware_1.protect, auth_middleware_1.admin, upload_middleware_1.default.single('image'), image_middleware_1.optimizeImage, project_controller_1.createProject);
router.put('/:id', auth_middleware_1.protect, auth_middleware_1.admin, upload_middleware_1.default.single('image'), image_middleware_1.optimizeImage, project_controller_1.updateProject);
router.delete('/:id', auth_middleware_1.protect, auth_middleware_1.admin, project_controller_1.deleteProject);
router.patch('/:id/status', auth_middleware_1.protect, auth_middleware_1.admin, project_controller_1.updateProjectStatus);
router.patch('/:id/update-date', auth_middleware_1.protect, auth_middleware_1.admin, project_controller_1.updateProjectDate);
exports.default = router;
