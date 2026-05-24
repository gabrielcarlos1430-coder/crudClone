"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orchestrator_controller_1 = require("./orchestrator.controller");
const router = (0, express_1.Router)();
/**
 * 🧠 ORQUESTRADOR CENTRAL DO SISTEMA
 */
router.post('/run', orchestrator_controller_1.OrchestratorController.run);
exports.default = router;
