"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionController = void 0;
const decision_service_1 = require("./decision.service");
class DecisionController {
    static decide(req, res) {
        const { history } = req.body;
        if (!history || !Array.isArray(history)) {
            return res.status(400).json({
                error: 'history deve ser um array'
            });
        }
        const result = decision_service_1.DecisionService.decide(history);
        return res.json(result);
    }
}
exports.DecisionController = DecisionController;
