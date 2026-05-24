"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const football_controller_1 = require("./football.controller");
const router = (0, express_1.Router)();
// ==========================================
// ⚽ LIVE
// ==========================================
router.get('/live', football_controller_1.FootballController.live.bind(football_controller_1.FootballController));
// ==========================================
// 📊 ANALYTICS
// ==========================================
router.get('/analytics', football_controller_1.FootballController.analytics.bind(football_controller_1.FootballController));
// ==========================================
// 🧠 PREDICTIONS
// ==========================================
router.get('/predictions', football_controller_1.FootballController.predictions.bind(football_controller_1.FootballController));
// ==========================================
// 💰 ODDS
// ==========================================
router.get('/odds', football_controller_1.FootballController.odds.bind(football_controller_1.FootballController));
exports.default = router;
