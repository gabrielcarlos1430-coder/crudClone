"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const strategy_controller_1 = require("./strategy.controller");
const router = (0, express_1.Router)();
/**
 * 🚀 roda todas estratégias
 */
router.post('/run-all', strategy_controller_1.StrategyController.runAll);
/**
 * 🎯 roda estratégia específica
 */
router.post('/run', strategy_controller_1.StrategyController.runOne);
exports.default = router;
