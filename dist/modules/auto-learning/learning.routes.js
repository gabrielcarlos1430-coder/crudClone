"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learning_controller_1 = require("./learning.controller");
const router = (0, express_1.Router)();
/**
 * 🧠 TREINAR SISTEMA
 */
router.post('/learn', learning_controller_1.LearningController.learn);
/**
 * 📊 RANKING INTELIGENTE
 */
router.post('/ranking', learning_controller_1.LearningController.ranking);
exports.default = router;
