"use strict";
// src/modules/self-improvement/mutation-factory.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationFactoryEngine = void 0;
const learning_memory_1 = require("../auto-learning/learning.memory");
const strategy_evolution_engine_1 = require("./strategy-evolution.engine");
// ==========================================
// 🧬 MUTATION FACTORY ENGINE
// ==========================================
class MutationFactoryEngine {
    // ==========================================
    // 🚀 CREATE MUTATIONS
    // ==========================================
    static async createMutations() {
        const evolution = await strategy_evolution_engine_1.StrategyEvolutionEngine
            .analyze();
        const created = [];
        const skipped = [];
        const recommendations = [];
        // ==========================================
        // 📊 NO BEST STRATEGIES
        // ==========================================
        if (!evolution.bestStrategies.length) {
            recommendations.push('Sem estratégias fortes suficientes');
            return {
                created,
                skipped,
                recommendations
            };
        }
        // ==========================================
        // 🧬 CREATE HYBRIDS
        // ==========================================
        for (let i = 0; i < evolution.bestStrategies.length; i++) {
            for (let j = i + 1; j < evolution.bestStrategies.length; j++) {
                const mutation = `${evolution.bestStrategies[i]}-${evolution.bestStrategies[j]}`;
                // ==========================================
                // 🔍 EXISTS
                // ==========================================
                const exists = learning_memory_1.LearningMemory.get(mutation);
                if (exists) {
                    skipped.push(mutation);
                    continue;
                }
                // ==========================================
                // 🧠 CREATE STRATEGY
                // ==========================================
                await learning_memory_1.LearningMemory.initStrategy(mutation);
                // ==========================================
                // ⚖️ BOOST INITIAL
                // ==========================================
                const parentA = learning_memory_1.LearningMemory.get(evolution.bestStrategies[i]);
                const parentB = learning_memory_1.LearningMemory.get(evolution.bestStrategies[j]);
                const avgWeight = ((parentA?.weight || 1) +
                    (parentB?.weight || 1)) / 2;
                // ==========================================
                // 🚀 UPDATE BOOST
                // ==========================================
                await learning_memory_1.LearningMemory.update(mutation, Math.floor(avgWeight));
                created.push(mutation);
            }
        }
        // ==========================================
        // 📊 RECOMMENDATIONS
        // ==========================================
        if (created.length) {
            recommendations.push('Novas mutações criadas');
        }
        if (skipped.length) {
            recommendations.push('Algumas mutações já existiam');
        }
        // ==========================================
        // 📊 LOG
        // ==========================================
        console.log(`🧬 MutationFactory | Created: ${created.length} | Skipped: ${skipped.length}`);
        // ==========================================
        // 🚀 RESULT
        // ==========================================
        return {
            created,
            skipped,
            recommendations
        };
    }
}
exports.MutationFactoryEngine = MutationFactoryEngine;
