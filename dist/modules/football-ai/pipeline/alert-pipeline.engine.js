"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertPipelineV6 = void 0;
const neural_trade_optimizer_1 = require("../neural/neural-trade.optimizer");
const neural_strategy_switcher_1 = require("../neural/neural-strategy.switcher");
class AlertPipelineV6 {
    static process(alerts) {
        const now = Date.now();
        const result = [];
        for (const alert of alerts) {
            if (!alert?.match)
                continue;
            const key = `${alert.type}-${alert.match.homeTeam}-${alert.match.awayTeam}`;
            let mem = this.memory.get(key);
            if (!mem) {
                mem = { lastSeen: now, count: 1, volatilityPenalty: 0 };
            }
            else {
                mem.count++;
                mem.volatilityPenalty += 2;
                mem.lastSeen = now;
            }
            if (mem.count > this.SPAM_LIMIT)
                continue;
            this.memory.set(key, mem);
            const last = this.cooldown.get(alert.type);
            if (last && now - last < this.COOLDOWN)
                continue;
            this.cooldown.set(alert.type, now);
            // =========================
            // SCORE BASE
            // =========================
            let score = alert.baseScore;
            score = neural_trade_optimizer_1.NeuralTradeOptimizer.adjustScore(alert.type, score);
            score = neural_strategy_switcher_1.NeuralStrategySwitcherV6.modifyScore(score, 'BALANCED');
            const liquidityScore = 70;
            const trustScore = (alert.confidence || 0) * 0.5;
            let alphaScore = score + liquidityScore * 0.3 + trustScore * 0.4 - mem.volatilityPenalty;
            alphaScore = Math.max(0, Math.min(100, alphaScore));
            const confidenceBoost = (alert.confidence || 0) * 0.15;
            const edgeBoost = (alert.edge || 0) * 0.6;
            let finalScore = alphaScore + confidenceBoost + edgeBoost;
            finalScore = Math.max(0, Math.min(100, finalScore));
            const priority = finalScore >= 88 ? 'CRITICAL'
                : finalScore >= 75 ? 'HIGH'
                    : finalScore >= 60 ? 'MEDIUM'
                        : 'LOW';
            const allowed = finalScore >= 62;
            result.push({
                ...alert,
                finalScore,
                priority,
                allowed,
                alphaScore,
                trustScore,
                liquidityScore,
            });
        }
        return result.sort((a, b) => b.finalScore - a.finalScore);
    }
}
exports.AlertPipelineV6 = AlertPipelineV6;
AlertPipelineV6.memory = new Map();
AlertPipelineV6.cooldown = new Map();
AlertPipelineV6.COOLDOWN = 10000;
AlertPipelineV6.SPAM_LIMIT = 4;
