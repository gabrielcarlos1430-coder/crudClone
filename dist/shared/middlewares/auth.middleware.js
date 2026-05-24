"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const token_service_1 = require("../../modules/auth/token.service");
const tokenBlacklist_service_1 = require("../../modules/auth/tokenBlacklist.service");
// ========================================
// 🔐 AUTH MIDDLEWARE
// ========================================
const authMiddleware = async (req, res, next) => {
    try {
        // ========================================
        // 🔍 AUTH HEADER
        // ========================================
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido',
                error: 'Unauthorized',
                data: null,
            });
        }
        // ========================================
        // 🔍 TOKEN FORMAT
        // ========================================
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
            return res.status(401).json({
                success: false,
                message: 'Token mal formatado',
                error: 'Unauthorized',
                data: null,
            });
        }
        const [scheme, token,] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({
                success: false,
                message: 'Token mal formatado',
                error: 'Unauthorized',
                data: null,
            });
        }
        // ========================================
        // 🚫 BLACKLIST
        // ========================================
        const blocked = await (0, tokenBlacklist_service_1.isBlacklisted)(token);
        if (blocked) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido (logout)',
                error: 'Unauthorized',
                data: null,
            });
        }
        // ========================================
        // 🔍 VERIFY JWT
        // ========================================
        const decoded = (0, token_service_1.verifyAccessToken)(token);
        const userId = decoded.sub
            ? Number(decoded.sub)
            : null;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
                error: 'Unauthorized',
                data: null,
            });
        }
        // ========================================
        // 👤 DATABASE USER
        // ========================================
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                plan: true,
                isActive: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado',
                error: 'Not Found',
                data: null,
            });
        }
        // ========================================
        // 🚫 USER BLOCKED
        // ========================================
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Usuário bloqueado',
                error: 'Forbidden',
                data: null,
            });
        }
        // ========================================
        // ✅ INJECT USER
        // ========================================
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
        };
        // ========================================
        // 🚀 NEXT
        // ========================================
        return next();
    }
    catch (error) {
        console.error('AUTH ERROR:', error);
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado',
            error: 'Unauthorized',
            data: null,
        });
    }
};
exports.authMiddleware = authMiddleware;
