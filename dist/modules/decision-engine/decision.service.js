"use strict";
// src/modules/decision-engine/decision.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisionService = void 0;
const strategy_service_1 = require("../strategy-engine/strategy.service");
const learning_memory_1 = require("../auto-learning/learning.memory");
const strategy_score_1 = require("../strategy-engine/strategy.score");
// ==========================================
// 🧠 DECISION ENGINE
// ==========================================
class DecisionService {
    // ==========================================
    // 🔥 ESCOLHE MELHOR STRATEGY
    // ==========================================
    static decide(history) {
        const results = strategy_service_1.StrategyService.runAll(history);
        // ==========================================
        // 🧠 RANKING
        // ==========================================
        const ranking = results.map(r => {
            // 🧠 memória da strategy
            const memory = learning_memory_1.LearningMemory.get(r.strategy);
            const weight = memory?.weight || 1;
            // 📊 score completo
            const scoreData = strategy_score_1.StrategyScoreEngine.evaluate(r.generated, r.simulation.accuracy, weight);
            return {
                strategy: r.strategy,
                accuracy: scoreData.accuracy,
                hits: r.simulation.hits,
                weight,
                coverage: scoreData.coverage,
                diversity: scoreData.diversity,
                score: scoreData.finalScore
            };
        })
            // 🔥 ordena por score
            .sort((a, b) => b.score - a.score);
        // ==========================================
        // 🏆 MELHOR
        // ==========================================
        const best = ranking[0];
        return {
            bestStrategy: best?.strategy || 'none',
            ranking
        };
    }
}
exports.DecisionService = DecisionService;
