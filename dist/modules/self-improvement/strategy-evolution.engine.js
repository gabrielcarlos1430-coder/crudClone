"use strict";
// src/modules/self-improvement/strategy-evolution.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyEvolutionEngine = void 0;
const feedback_memory_1 = require("../feedback/feedback.memory");
const learning_memory_1 = require("../auto-learning/learning.memory");
// ==========================================
// 🧬 STRATEGY EVOLUTION ENGINE
// ==========================================
class StrategyEvolutionEngine {
    // ==========================================
    // 🚀 ANALYZE
    // ==========================================
    static async analyze() {
        const feedbacks = await feedback_memory_1.FeedbackMemory.getAll();
        const learning = learning_memory_1.LearningMemory.getAll();
        // ==========================================
        // 📊 EMPTY
        // ==========================================
        if (!feedbacks.length) {
            return {
                bestStrategies: [],
                worstStrategies: [],
                retiredStrategies: [],
                boostedStrategies: [],
                mutations: [],
                recommendations: [
                    'Sem feedback suficiente'
                ]
            };
        }
        // ==========================================
        // 📊 STRATEGY MAP
        // ==========================================
        const map = {};
        for (const item of feedbacks) {
            if (!map[item.strategy]) {
                map[item.strategy] = [];
            }
            map[item.strategy]
                .push(item.accuracy);
        }
        // ==========================================
        // 📊 AVG
        // ==========================================
        const averages = Object.entries(map).map(([strategy, values]) => {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            return {
                strategy,
                avg
            };
        });
        // ==========================================
        // 🏆 BEST
        // ==========================================
        const bestStrategies = averages
            .filter(s => s.avg >= 60)
            .map(s => s.strategy);
        // ==========================================
        // ☠️ WORST
        // ==========================================
        const worstStrategies = averages
            .filter(s => s.avg <= 20)
            .map(s => s.strategy);
        // ==========================================
        // 🚀 BOOSTED
        // ==========================================
        const boostedStrategies = learning
            .filter(s => s.weight >= 5)
            .map(s => s.name);
        // ==========================================
        // ☠️ RETIRED
        // ==========================================
        const retiredStrategies = worstStrategies.filter(strategy => {
            const strategyMemory = learning.find(l => l.name === strategy);
            return (strategyMemory?.runs || 0) > 10;
        });
        // ==========================================
        // 🧬 MUTATIONS
        // ==========================================
        const mutations = [];
        for (let i = 0; i < bestStrategies.length; i++) {
            for (let j = i + 1; j < bestStrategies.length; j++) {
                mutations.push(`${bestStrategies[i]}-${bestStrategies[j]}`);
            }
        }
        // ==========================================
        // 📊 RECOMMENDATIONS
        // ==========================================
        const recommendations = [];
        if (bestStrategies.length) {
            recommendations.push('Boost estratégias vencedoras');
        }
        if (retiredStrategies.length) {
            recommendations.push('Aposentar estratégias fracas');
        }
        if (mutations.length) {
            recommendations.push('Criar estratégias híbridas');
        }
        // ==========================================
        // 🚀 RESULT
        // ==========================================
        return {
            bestStrategies,
            worstStrategies,
            retiredStrategies,
            boostedStrategies,
            mutations,
            recommendations
        };
    }
}
exports.StrategyEvolutionEngine = StrategyEvolutionEngine;
