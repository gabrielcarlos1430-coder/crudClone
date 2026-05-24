"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorController = void 0;
const simulator_service_1 = require("./simulator.service");
class SimulatorController {
    static run(req, res) {
        const { history, generated } = req.body;
        if (!history || !generated) {
            return res.status(400).json({
                error: 'history e generated são obrigatórios'
            });
        }
        const result = simulator_service_1.SimulatorService.runSimulation(history, generated);
        return res.json(result);
    }
    static compare(req, res) {
        const { history } = req.body;
        if (!history) {
            return res.status(400).json({
                error: 'history é obrigatório'
            });
        }
        const result = simulator_service_1.SimulatorService.compareStrategies(history);
        return res.json(result);
    }
}
exports.SimulatorController = SimulatorController;
