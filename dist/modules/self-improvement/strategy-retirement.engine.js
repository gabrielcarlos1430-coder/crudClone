"use strict";
// src/modules/self-improvement/strategy-retirement.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRetirementEngine = void 0;
const learning_memory_1 = require("../auto-learning/learning.memory");
// ==========================================
// 🧠 STRATEGY RETIREMENT ENGINE
// ==========================================
class StrategyRetirementEngine {
    // ==========================================
    // 🚀 MAIN
    // ==========================================
    static analyze() {
        const memory = learning_memory_1.LearningMemory.getAll();
        const retired = [];
        const recommendations = [];
        // ==========================================
        // 🔍 ANALYZE
        // ==========================================
        for (const strategy of memory) {
            let reason = '';
            // ==========================================
            // ❌ VERY LOW WEIGHT
            // ==========================================
            if (strategy.weight < 2 &&
                strategy.runs > 10) {
                reason =
                    'low_weight';
            }
            // ==========================================
            // ❌ BAD HIT RATE
            // ==========================================
            const averageHits = strategy.runs > 0
                ? strategy.hits /
                    strategy.runs
                : 0;
            if (averageHits < 0.5 &&
                strategy.runs > 20) {
                reason =
                    'low_hit_rate';
            }
            // ==========================================
            // ❌ DEAD STRATEGY
            // ==========================================
            if (strategy.hits === 0 &&
                strategy.runs > 30) {
                reason =
                    'dead_strategy';
            }
            // ==========================================
            // 📊 RETIRE
            // ==========================================
            if (reason) {
                retired.push({
                    name: strategy.name,
                    reason,
                    weight: Number(strategy.weight
                        .toFixed(2)),
                    hits: strategy.hits,
                    runs: strategy.runs
                });
            }
        }
        // ==========================================
        // 💡 RECOMMENDATIONS
        // ==========================================
        if (retired.length > 0) {
            recommendations.push('mutate_retired_strategies');
            recommendations.push('increase_exploration');
        }
        if (retired.length >= 3) {
            recommendations.push('rebalance_system');
        }
        // ==========================================
        // 📊 ACTIVE
        // ==========================================
        const active = memory.length -
            retired.length;
        // ==========================================
        // ✅ FINAL
        // ==========================================
        return {
            retired,
            active,
            retiredCount: retired.length,
            recommendations
        };
    }
}
exports.StrategyRetirementEngine = StrategyRetirementEngine;
