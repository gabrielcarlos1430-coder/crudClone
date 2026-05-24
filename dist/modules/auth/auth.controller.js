"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.verify2FA = verify2FA;
exports.refresh = refresh;
exports.logout = logout;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../database/prisma"));
const ipBlock_middleware_1 = require("../../shared/middlewares/ipBlock.middleware");
const auth_service_1 = require("./auth.service");
const password_service_1 = require("./password.service");
const tokenBlacklist_service_1 = require("./tokenBlacklist.service");
// ========================================
// 🔧 GET CLIENT IP
// ========================================
function getClientIp(req) {
    let ip = req.headers['x-forwarded-for']
        ?.split(',')[0]
        ?.trim() ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown';
    if (ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    return ip;
}
// ========================================
// 🔐 LOGIN
// ========================================
async function login(req, res) {
    const ip = getClientIp(req);
    try {
        const { email, password, } = req.body;
        if (!email ||
            !password) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios',
                error: 'Dados inválidos',
                data: null,
            });
        }
        const userAgent = req.headers['user-agent'] || 'unknown';
        const result = await (0, auth_service_1.loginService)(email, password, ip, userAgent);
        await (0, ipBlock_middleware_1.resetAttempts)(ip);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                message: result.message,
                security: {
                    suspiciousLogin: result.suspicious || false,
                },
            },
        });
    }
    catch (error) {
        await (0, ipBlock_middleware_1.registerFailedAttempt)(ip);
        return res.status(400).json({
            success: false,
            message: error.message ||
                'Erro no login',
            error: error.message ||
                'Erro no login',
            data: null,
        });
    }
}
// ========================================
// 🔐 VERIFY 2FA
// ========================================
async function verify2FA(req, res) {
    try {
        const { email, code, } = req.body;
        if (!email ||
            !code) {
            return res.status(400).json({
                success: false,
                message: 'Email e código são obrigatórios',
                error: 'Dados inválidos',
                data: null,
            });
        }
        const result = await (0, auth_service_1.verify2FAService)(email, code);
        return res.json({
            success: true,
            message: '2FA verificado com sucesso',
            data: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message ||
                'Erro na verificação',
            error: error.message ||
                'Erro na verificação',
            data: null,
        });
    }
}
// ========================================
// 🔄 REFRESH TOKEN
// ========================================
async function refresh(req, res) {
    try {
        const { refreshToken, } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token obrigatório',
                error: 'Refresh token obrigatório',
                data: null,
            });
        }
        // 🔍 verifica assinatura
        try {
            jsonwebtoken_1.default.verify(refreshToken, process.env
                .JWT_REFRESH_SECRET);
        }
        catch {
            return res.status(403).json({
                success: false,
                message: 'Refresh token inválido',
                error: 'Refresh token inválido',
                data: null,
            });
        }
        // 🔍 banco
        const storedToken = await prisma_1.default.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
        });
        if (!storedToken) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token não encontrado',
                error: 'Refresh token inválido',
                data: null,
            });
        }
        // ⏰ expirado
        if (storedToken.expiresAt <
            new Date()) {
            await prisma_1.default.refreshToken.delete({
                where: {
                    token: refreshToken,
                },
            });
            return res.status(403).json({
                success: false,
                message: 'Refresh token expirado',
                error: 'Refresh token expirado',
                data: null,
            });
        }
        // 🔥 service
        const result = await (0, auth_service_1.refreshService)(refreshToken);
        return res.json({
            success: true,
            message: 'Token renovado com sucesso',
            data: {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message ||
                'Erro ao renovar token',
            error: error.message ||
                'Erro interno',
            data: null,
        });
    }
}
// ========================================
// 🚪 LOGOUT
// ========================================
async function logout(req, res) {
    try {
        const authHeader = req.headers.authorization;
        const { refreshToken, } = req.body;
        if (!authHeader ||
            !refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Access token e refresh token são obrigatórios',
                error: 'Dados inválidos',
                data: null,
            });
        }
        const [, accessToken] = authHeader.split(' ');
        // 🔥 blacklist access
        const decoded = jsonwebtoken_1.default.decode(accessToken);
        if (decoded?.exp) {
            await (0, tokenBlacklist_service_1.blacklistToken)(accessToken, decoded.exp);
        }
        const result = await (0, auth_service_1.logoutService)(refreshToken);
        return res.json({
            success: true,
            message: result.message,
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message ||
                'Erro ao fazer logout',
            error: error.message ||
                'Erro interno',
            data: null,
        });
    }
}
// ========================================
// 📩 FORGOT PASSWORD
// ========================================
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email obrigatório',
                error: 'Dados inválidos',
                data: null,
            });
        }
        const result = await (0, password_service_1.forgotPasswordService)(email);
        return res.json({
            success: true,
            message: 'Email enviado com sucesso',
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            error: error.message,
            data: null,
        });
    }
}
// ========================================
// 🔐 RESET PASSWORD
// ========================================
async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;
        if (!token ||
            !password) {
            return res.status(400).json({
                success: false,
                message: 'Token e senha obrigatórios',
                error: 'Dados inválidos',
                data: null,
            });
        }
        const result = await (0, password_service_1.resetPasswordService)(token, password);
        return res.json({
            success: true,
            message: 'Senha redefinida com sucesso',
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            error: error.message,
            data: null,
        });
    }
}
