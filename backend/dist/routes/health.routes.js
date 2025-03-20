"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthRouter = (0, express_1.Router)();
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
exports.default = healthRouter;
