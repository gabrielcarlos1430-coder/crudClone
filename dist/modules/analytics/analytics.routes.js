"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
// ==========================================
// 🔥 ANALYTICS PRINCIPAL
// ==========================================
router.post('/analyze', analytics_controller_1.AnalyticsController.analyze);
// ==========================================
// 🔥 HOT DATABASE
// ==========================================
router.get('/hot', analytics_controller_1.AnalyticsController.hot);
// ==========================================
// ❄️ COLD DATABASE
// ==========================================
router.get('/cold', analytics_controller_1.AnalyticsController.cold);
// ==========================================
// 📦 SOURCE STATS
// ==========================================
router.get('/sources', analytics_controller_1.AnalyticsController.sources);
exports.default = router;
