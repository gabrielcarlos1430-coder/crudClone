"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = loginService;
exports.verify2FAService = verify2FAService;
exports.refreshService = refreshService;
exports.logoutService = logoutService;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../database/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const token_service_1 = require("./token.service");
const mail_service_1 = require("../mail/mail.service");
const mailService = new mail_service_1.MailService();
// 🔥 DEV MODE
const DEV_MODE = process.env.NODE_ENV !== 'production';
// ========================================
// 🔐 2FA
// ========================================
function generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function hashCode(code) {
    return crypto_1.default
        .createHash('sha256')
        .update(code)
        .digest('hex');
}
// ========================================
// 🔐 LOGIN
// ========================================
async function loginService(email, password, ip, userAgent) {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password: true,
            isActive: true,
            loginAttempts: true,
            lockUntil: true,
            lastLoginIp: true,
            lastUserAgent: true,
        },
    });
    if (!user || !user.isActive) {
        throw new Error('Credenciais inválidas');
    }
    // 🔒 conta bloqueada
    if (user.lockUntil &&
        user.lockUntil > new Date()) {
        throw new Error('Conta temporariamente bloqueada');
    }
    // 🔑 senha
    const passwordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        const attempts = user.loginAttempts + 1;
        // 🔥 bloqueio
        if (attempts >= 5) {
            await prisma_1.default.user.update({
                where: { id: user.id },
                data: {
                    loginAttempts: 0,
                    lockUntil: new Date(Date.now() + 15 * 60 * 1000),
                },
            });
            throw new Error('Conta temporariamente bloqueada');
        }
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: attempts,
            },
        });
        throw new Error('Credenciais inválidas');
    }
    // 🔍 login suspeito
    const suspicious = (user.lastLoginIp &&
        user.lastLoginIp !== ip) ||
        (user.lastUserAgent &&
            user.lastUserAgent !== userAgent);
    // 🔐 gerar 2FA
    const code = generate2FACode();
    const hashedCode = hashCode(code);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            loginAttempts: 0,
            lockUntil: null,
            lastLoginIp: ip,
            lastUserAgent: userAgent,
            twoFactorCode: hashedCode,
            twoFactorExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
    });
    try {
        if (DEV_MODE) {
            console.log('🔐 Código 2FA (DEV):', code);
        }
        else {
            await mailService.send2FACode(user.email, code);
        }
    }
    catch (err) {
        console.error('❌ Erro envio 2FA:', err);
        console.log('🔐 Código fallback:', code);
    }
    return {
        message: 'Código de verificação enviado',
        suspicious,
    };
}
// ========================================
// 🔐 VERIFY 2FA
// ========================================
async function verify2FAService(email, code) {
    const user = await prisma_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            twoFactorCode: true,
            twoFactorExpires: true,
            role: true,
            plan: true,
        },
    });
    if (!user ||
        !user.twoFactorCode) {
        throw new Error('Código inválido');
    }
    // ⏰ expirado
    if (!user.twoFactorExpires ||
        user.twoFactorExpires < new Date()) {
        throw new Error('Código expirado');
    }
    const hashedCode = hashCode(code);
    if (user.twoFactorCode !== hashedCode) {
        throw new Error('Código inválido');
    }
    // 🧹 limpa 2FA
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            twoFactorCode: null,
            twoFactorExpires: null,
        },
    });
    // 🔐 tokens
    const accessToken = (0, token_service_1.generateAccessToken)(user.id, user.role, user.plan);
    const refreshToken = (0, token_service_1.generateRefreshToken)(user.id);
    // 💾 salva refresh
    await prisma_1.default.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() +
                7 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        accessToken,
        refreshToken,
    };
}
// ========================================
// 🔄 REFRESH TOKEN
// ========================================
async function refreshService(oldRefreshToken) {
    // 🔍 verifica assinatura JWT
    const payload = (0, token_service_1.verifyRefreshToken)(oldRefreshToken);
    const userId = Number(payload.sub);
    if (!userId) {
        throw new Error('Refresh token inválido');
    }
    // 🔍 procura no banco
    const tokenExists = await prisma_1.default.refreshToken.findUnique({
        where: {
            token: oldRefreshToken,
        },
    });
    if (!tokenExists) {
        throw new Error('Refresh token não encontrado');
    }
    // ⏰ expirado
    if (tokenExists.expiresAt <
        new Date()) {
        await prisma_1.default.refreshToken.delete({
            where: {
                token: oldRefreshToken,
            },
        });
        throw new Error('Refresh token expirado');
    }
    // 🔥 rotation
    await prisma_1.default.refreshToken.delete({
        where: {
            token: oldRefreshToken,
        },
    });
    // 👤 usuário
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            role: true,
            plan: true,
        },
    });
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    // 🔐 novos tokens
    const accessToken = (0, token_service_1.generateAccessToken)(userId, user.role, user.plan);
    const refreshToken = (0, token_service_1.generateRefreshToken)(userId);
    // 💾 salva novo refresh
    await prisma_1.default.refreshToken.create({
        data: {
            token: refreshToken,
            userId,
            expiresAt: new Date(Date.now() +
                7 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        accessToken,
        refreshToken,
    };
}
// ========================================
// 🚪 LOGOUT
// ========================================
async function logoutService(refreshToken) {
    await prisma_1.default.refreshToken.deleteMany({
        where: {
            token: refreshToken,
        },
    });
    return {
        message: 'Logout realizado com sucesso',
    };
}
