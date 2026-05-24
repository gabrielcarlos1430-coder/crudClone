"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyController = void 0;
const strategy_service_1 = require("./strategy.service");
class StrategyController {
    static runAll(req, res) {
        const { history } = req.body;
        if (!history) {
            return res.status(400).json({
                error: 'history é obrigatório'
            });
        }
        const result = strategy_service_1.StrategyService.runAll(history);
        return res.json(result);
    }
    static runOne(req, res) {
        const { name, history } = req.body;
        if (!name || !history) {
            return res.status(400).json({
                error: 'name e history são obrigatórios'
            });
        }
        try {
            const result = strategy_service_1.StrategyService.runOne(name, history);
            return res.json(result);
        }
        catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
}
exports.StrategyController = StrategyController;
