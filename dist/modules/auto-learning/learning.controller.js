"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningController = void 0;
const learning_engine_1 = require("./learning.engine");
class LearningController {
    static learn(req, res) {
        const { history } = req.body;
        if (!history) {
            return res.status(400).json({
                error: 'history obrigatório'
            });
        }
        const result = learning_engine_1.LearningEngine.learn(history);
        return res.json(result);
    }
    static ranking(req, res) {
        const { history } = req.body;
        const result = learning_engine_1.LearningEngine.getSmartRanking(history);
        return res.json(result);
    }
}
exports.LearningController = LearningController;
