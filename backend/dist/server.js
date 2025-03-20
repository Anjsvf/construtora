"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const auth_controller_1 = require("./controllers/auth.controller");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const banner_routes_1 = __importDefault(require("./routes/banner.routes"));
const projects_routes_1 = __importDefault(require("./routes/projects.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.connectDB)()
    .then(() => {
    // Create initial admin user after DB connection
    (0, auth_controller_1.createInitialAdminUser)();
})
    .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5000', 'http://localhost:5173'], // Permite ambos os endereços do frontend
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' } // Permite recursos de diferentes origens
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Serve static files from uploads directory
const uploadsPath = path_1.default.join(__dirname, '../uploads');
console.log('Servindo arquivos estáticos de:', uploadsPath);
app.use('/uploads', express_1.default.static(uploadsPath));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/projects', projects_routes_1.default);
app.use('/api/banner', banner_routes_1.default);
app.use('/health', health_routes_1.default);
// Default route
app.get('/', (req, res) => {
    res.send('Construtora API is running...');
});
// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});
// Middleware de tratamento de erros
app.use(error_middleware_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
