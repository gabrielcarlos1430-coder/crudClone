"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const decision_controller_1 = require("./decision.controller");
const router = (0, express_1.Router)();
/**
 * 🧠 DECISOR CENTRAL
 */
router.post('/decide', decision_controller_1.DecisionController.decide);
exports.default = router;
