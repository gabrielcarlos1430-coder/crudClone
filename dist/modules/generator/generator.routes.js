"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generator_controller_1 = require("./generator.controller");
const router = (0, express_1.Router)();
/**
 * 🎲 GERADOR DE APOSTAS
 */
router.post('/generate', generator_controller_1.GeneratorController.generate);
exports.default = router;
