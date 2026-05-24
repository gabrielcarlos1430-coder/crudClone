"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorController = void 0;
const generator_service_1 = require("./generator.service");
class GeneratorController {
    static generate(req, res) {
        const { quantity, size, hotNumbers, coldNumbers } = req.body;
        if (!quantity || !size) {
            return res.status(400).json({
                error: 'quantity e size são obrigatórios'
            });
        }
        const result = generator_service_1.GeneratorService.generate({
            quantity,
            size,
            hotNumbers,
            coldNumbers,
        });
        return res.json(result);
    }
}
exports.GeneratorController = GeneratorController;
