"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const simulator_controller_1 = require("./simulator.controller");
const router = (0, express_1.Router)();
/**
 * 🧪 SIMULAÇÃO SIMPLES
 */
router.post('/run', simulator_controller_1.SimulatorController.run);
/**
 * ⚖️ COMPARAÇÃO DE ESTRATÉGIAS
 */
router.post('/compare', simulator_controller_1.SimulatorController.compare);
exports.default = router;
