"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeImages = exports.optimizeImage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
// Obter configurações das variáveis de ambiente com valores padrão
const WEBP_QUALITY = parseInt(process.env.WEBP_QUALITY || '80');
const WEBP_COMPRESSION_LEVEL = parseInt(process.env.WEBP_COMPRESSION_LEVEL || '6');
const MAX_IMAGE_WIDTH = parseInt(process.env.MAX_IMAGE_WIDTH || '1920');
const MAX_IMAGE_HEIGHT = parseInt(process.env.MAX_IMAGE_HEIGHT || '1080');
/**
 * Middleware para converter imagens para WebP e otimizá-las
 * Deve ser usado após o upload do multer
 */
const optimizeImage = async (req, res, next) => {
    try {
        // Se não houver arquivo, pular
        if (!req.file) {
            console.log('Nenhum arquivo para otimizar');
            return next();
        }
        const file = req.file;
        // Caminho do arquivo original
        const filePath = file.path;
        // Verificar se o arquivo existe
        if (!fs_1.default.existsSync(filePath)) {
            console.error(`Arquivo original não encontrado: ${filePath}`);
            return next();
        }
        // Gerar novo nome de arquivo com extensão WebP
        const filename = path_1.default.basename(filePath, path_1.default.extname(filePath));
        const webpFilename = `${filename}.webp`;
        const webpFilePath = path_1.default.join(path_1.default.dirname(filePath), webpFilename);
        console.log('Convertendo imagem para WebP:', filePath, '->', webpFilePath);
        console.log(`Configurações: Qualidade=${WEBP_QUALITY}, Compressão=${WEBP_COMPRESSION_LEVEL}`);
        try {
            // Converter para WebP e otimizar
            await (0, sharp_1.default)(filePath)
                .webp({
                quality: WEBP_QUALITY,
                effort: WEBP_COMPRESSION_LEVEL
            })
                .resize({
                width: MAX_IMAGE_WIDTH,
                height: MAX_IMAGE_HEIGHT,
                fit: 'inside',
                withoutEnlargement: true
            })
                .toFile(webpFilePath);
            console.log('Imagem convertida com sucesso para WebP');
            // Obter informações do arquivo original e convertido para mostrar ganho de tamanho
            const originalStats = fs_1.default.statSync(filePath);
            const webpStats = fs_1.default.statSync(webpFilePath);
            const originalSize = originalStats.size / 1024; // KB
            const webpSize = webpStats.size / 1024; // KB
            const reduction = 100 - (webpSize / originalSize * 100);
            console.log(`Tamanho original: ${originalSize.toFixed(2)} KB`);
            console.log(`Tamanho WebP: ${webpSize.toFixed(2)} KB`);
            console.log(`Redução: ${reduction.toFixed(2)}%`);
            // GARANTIR que o arquivo original seja removido
            try {
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                    console.log('Arquivo original removido com sucesso:', filePath);
                }
                else {
                    console.log('Arquivo original não encontrado para remoção:', filePath);
                }
            }
            catch (deleteErr) {
                console.error('Erro ao tentar remover arquivo original:', deleteErr);
            }
            // Atualizar req.file para apontar para o novo arquivo webp
            req.file.filename = webpFilename;
            req.file.path = webpFilePath;
            req.file.mimetype = 'image/webp';
            // Verificação final - confirmar que apenas o arquivo WebP existe
            const uploadDir = path_1.default.dirname(filePath);
            const filesInDir = fs_1.default.readdirSync(uploadDir)
                .filter(f => f.startsWith(filename) && !f.endsWith('.webp'));
            if (filesInDir.length > 0) {
                console.warn('Arquivos originais ainda presentes, tentando remover:', filesInDir);
                for (const file of filesInDir) {
                    try {
                        fs_1.default.unlinkSync(path_1.default.join(uploadDir, file));
                        console.log(`Arquivo extra removido: ${file}`);
                    }
                    catch (e) {
                        console.error(`Não foi possível remover o arquivo: ${file}`, e);
                    }
                }
            }
            console.log('Otimização de imagem concluída com sucesso');
        }
        catch (conversionError) {
            console.error('Erro na conversão para WebP:', conversionError);
            // Se falhou a conversão, não mudar o arquivo
            return next();
        }
        next();
    }
    catch (error) {
        console.error('Erro geral no middleware de otimização:', error);
        // Em caso de erro, continuar com o upload original
        next();
    }
};
exports.optimizeImage = optimizeImage;
/**
 * Versão para múltiplos arquivos (multer array)
 */
const optimizeImages = async (req, res, next) => {
    try {
        // Se não houver arquivos, pular
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            console.log('Nenhum arquivo para processamento em lote');
            return next();
        }
        console.log(`Iniciando processamento de ${req.files.length} imagens`);
        // Processar cada arquivo
        const processPromises = req.files.map(async (file) => {
            // Caminho do arquivo original
            const filePath = file.path;
            // Verificar se o arquivo existe
            if (!fs_1.default.existsSync(filePath)) {
                console.error(`Arquivo original não encontrado: ${filePath}`);
                return;
            }
            // Gerar novo nome de arquivo com extensão WebP
            const filename = path_1.default.basename(filePath, path_1.default.extname(filePath));
            const webpFilename = `${filename}.webp`;
            const webpFilePath = path_1.default.join(path_1.default.dirname(filePath), webpFilename);
            try {
                // Converter para WebP e otimizar
                await (0, sharp_1.default)(filePath)
                    .webp({
                    quality: WEBP_QUALITY,
                    effort: WEBP_COMPRESSION_LEVEL
                })
                    .resize({
                    width: MAX_IMAGE_WIDTH,
                    height: MAX_IMAGE_HEIGHT,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                    .toFile(webpFilePath);
                // Obter informações do arquivo original e convertido para mostrar ganho de tamanho
                const originalStats = fs_1.default.statSync(filePath);
                const webpStats = fs_1.default.statSync(webpFilePath);
                const originalSize = originalStats.size / 1024; // KB
                const webpSize = webpStats.size / 1024; // KB
                const reduction = 100 - (webpSize / originalSize * 100);
                console.log(`Arquivo ${filename}: ${originalSize.toFixed(2)} KB -> ${webpSize.toFixed(2)} KB (-${reduction.toFixed(2)}%)`);
                // GARANTIR que o arquivo original seja removido
                try {
                    if (fs_1.default.existsSync(filePath)) {
                        fs_1.default.unlinkSync(filePath);
                        console.log('Arquivo original removido com sucesso:', filePath);
                    }
                }
                catch (deleteErr) {
                    console.error('Erro ao tentar remover arquivo original:', deleteErr);
                }
                // Atualizar informações do arquivo
                file.filename = webpFilename;
                file.path = webpFilePath;
                file.mimetype = 'image/webp';
            }
            catch (conversionError) {
                console.error(`Erro ao processar o arquivo ${filename}:`, conversionError);
            }
        });
        // Aguardar processamento de todas as imagens
        await Promise.all(processPromises);
        console.log(`${req.files.length} imagens processadas`);
        next();
    }
    catch (error) {
        console.error('Erro geral no middleware de otimização em lote:', error);
        // Em caso de erro, continuar com os uploads originais
        next();
    }
};
exports.optimizeImages = optimizeImages;
