"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const numbers_controller_1 = require("./numbers.controller");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/generate", auth_middleware_1.authMiddleware, numbers_controller_1.generateNumbersController);
router.get("/history", auth_middleware_1.authMiddleware, numbers_controller_1.getUserHistoryController);
router.delete("/history", auth_middleware_1.authMiddleware, numbers_controller_1.clearUserHistoryController);
router.get("/ranking", auth_middleware_1.authMiddleware, numbers_controller_1.getRankingController);
// 🔥 NOVO
router.get("/hot-cold", auth_middleware_1.authMiddleware, numbers_controller_1.getHotColdController);
exports.default = router;
