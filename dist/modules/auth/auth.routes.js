"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const me_controller_1 = require("./me.controller");
const auth_schema_1 = require("./auth.schema");
const validate_middleware_1 = require("../../shared/middlewares/validate.middleware");
const ipBlock_middleware_1 = require("../../shared/middlewares/ipBlock.middleware");
const rateLimit_middleware_1 = require("../../shared/middlewares/rateLimit.middleware");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ========================================
// 🔐 LOGIN
// ========================================
router.post('/login', ipBlock_middleware_1.ipBlockMiddleware, rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.loginSchema), auth_controller_1.login);
// ========================================
// 🔐 VERIFY 2FA
// ========================================
router.post('/verify-2fa', ipBlock_middleware_1.ipBlockMiddleware, rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.verify2FASchema), auth_controller_1.verify2FA);
// ========================================
// 🔄 REFRESH TOKEN
// ========================================
router.post('/refresh', auth_controller_1.refresh);
// ========================================
// 🚪 LOGOUT
// ========================================
router.post('/logout', auth_controller_1.logout);
// ========================================
// 👤 AUTH USER PROFILE
// ========================================
router.get('/me', auth_middleware_1.authMiddleware, me_controller_1.me);
// ========================================
// 📩 FORGOT PASSWORD
// ========================================
router.post('/forgot-password', ipBlock_middleware_1.ipBlockMiddleware, rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.forgotPasswordSchema), auth_controller_1.forgotPassword);
// ========================================
// 🔐 RESET PASSWORD
// ========================================
router.post('/reset-password', ipBlock_middleware_1.ipBlockMiddleware, rateLimit_middleware_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.resetPasswordSchema), auth_controller_1.resetPassword);
exports.default = router;
