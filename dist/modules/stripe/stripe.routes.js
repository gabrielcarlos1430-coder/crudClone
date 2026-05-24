"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express")); // 🔥 FALTAVA ISSO
const stripe_controller_1 = require("./stripe.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
// 🔐 usuário logado
router.post("/checkout", auth_middleware_1.authMiddleware, stripe_controller_1.createCheckoutSession);
// ⚠️ webhook NÃO usa JSON normal (Stripe exige RAW)
router.post("/webhook", express_2.default.raw({ type: "application/json" }), stripe_controller_1.handleWebhook);
exports.default = router;
