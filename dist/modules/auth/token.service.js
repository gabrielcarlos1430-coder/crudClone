"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';
const ISSUER = 'api-node-prisma';
const AUDIENCE = 'users';
// ========================================
// 🔐 VALIDAR SECRETS
// ========================================
function assertSecrets() {
    if (!process.env.JWT_SECRET ||
        !process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT secrets não configurados');
    }
}
// ========================================
// 🔐 ACCESS TOKEN
// ========================================
function generateAccessToken(userId, role, plan) {
    assertSecrets();
    if (!userId) {
        throw new Error('userId inválido');
    }
    return jsonwebtoken_1.default.sign({
        sub: String(userId),
        role: role || 'USER',
        plan: plan || 'FREE',
        jti: crypto_1.default.randomUUID(),
    }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_EXPIRES,
        issuer: ISSUER,
        audience: AUDIENCE,
    });
}
// ========================================
// 🔐 REFRESH TOKEN
// ========================================
function generateRefreshToken(userId) {
    assertSecrets();
    if (!userId) {
        throw new Error('userId inválido');
    }
    return jsonwebtoken_1.default.sign({
        sub: String(userId),
        jti: crypto_1.default.randomUUID(),
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES,
        issuer: ISSUER,
        audience: AUDIENCE,
    });
}
// ========================================
// 🔍 VERIFY ACCESS
// ========================================
function verifyAccessToken(token) {
    assertSecrets();
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, {
        issuer: ISSUER,
        audience: AUDIENCE,
    });
    if (!decoded.sub) {
        throw new Error('Access token inválido');
    }
    return decoded;
}
// ========================================
// 🔍 VERIFY REFRESH
// ========================================
function verifyRefreshToken(token) {
    assertSecrets();
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, {
        issuer: ISSUER,
        audience: AUDIENCE,
    });
    if (!decoded.sub) {
        throw new Error('Refresh token inválido');
    }
    return decoded;
}
