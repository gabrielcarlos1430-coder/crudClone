"use strict";
// src/modules/auto-learning/learning.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningEngine = void 0;
const learning_memory_1 = require("./learning.memory");
const strategy_service_1 = require("../strategy-engine/strategy.service");
const temporal_weight_engine_1 = require("../strategy-engine/temporal-weight.engine");
// ==========================================
// 🧠 AUTO LEARNING ENGINE
// ==========================================
class LearningEngine {
    // ==========================================
    // 🚀 LEARN
    // ==========================================
    static async learn(history) {
        const results = strategy_service_1.StrategyService.runAll(history);
        // ==========================================
        // 🕒 CURRENT HOUR
        // ==========================================
        const currentHour = new Date().getHours();
        // ==========================================
        // 📊 SUMMARY
        // ==========================================
        let totalHits = 0;
        let totalAccuracy = 0;
        // ==========================================
        // 🧠 LEARNING LOOP
        // ==========================================
        for (const r of results) {
            const hits = r.simulation.hits;
            const accuracy = r.simulation.accuracy;
            totalHits += hits;
            totalAccuracy += accuracy;
            // ==========================================
            // 🌍 GLOBAL MEMORY
            // ==========================================
            await learning_memory_1.LearningMemory.update(r.strategy, hits);
            // ==========================================
            // 🕒 TEMPORAL MEMORY
            // ==========================================
            await temporal_weight_engine_1.TemporalWeightEngine.update(r.strategy, hits, currentHour);
        }
        // ==========================================
        // 📊 AVERAGES
        // ==========================================
        const averageAccuracy = results.length > 0
            ? totalAccuracy / results.length
            : 0;
        // ==========================================
        // 🏆 BEST STRATEGY
        // ==========================================
        const best = results.sort((a, b) => b.simulation.accuracy -
            a.simulation.accuracy)[0];
        // ==========================================
        // 📊 OUTPUT
        // ==========================================
        return {
            success: true,
            message: 'Learning atualizado com sucesso',
            processedStrategies: results.length,
            totalHits,
            averageAccuracy: Number(averageAccuracy.toFixed(2)),
            bestStrategy: best?.strategy || null,
            bestAccuracy: best?.simulation.accuracy || 0,
            globalMemory: learning_memory_1.LearningMemory.getAll(),
            temporalMemory: temporal_weight_engine_1.TemporalWeightEngine.getAll()
        };
    }
    // ==========================================
    // 🧠 SMART RANKING
    // ==========================================
    static getSmartRanking(history) {
        const results = strategy_service_1.StrategyService.runAll(history);
        const currentHour = new Date().getHours();
        const memory = learning_memory_1.LearningMemory.getAll();
        // ==========================================
        // 📊 ENRICH
        // ==========================================
        const enriched = results.map(r => {
            const globalMemory = memory.find(m => m.name ===
                r.strategy);
            const temporalWeight = temporal_weight_engine_1.TemporalWeightEngine.getWeight(r.strategy, currentHour);
            // ==========================================
            // ⚖️ FINAL WEIGHT
            // ==========================================
            const finalWeight = ((globalMemory?.weight || 1)
                +
                    temporalWeight) / 2;
            // ==========================================
            // 📊 SMART SCORE
            // ==========================================
            const smartScore = (r.simulation.accuracy *
                0.6)
                +
                    (finalWeight * 10 *
                        0.4);
            return {
                strategy: r.strategy,
                accuracy: Number(r.simulation.accuracy
                    .toFixed(2)),
                hits: r.simulation.hits,
                temporalWeight: Number(temporalWeight
                    .toFixed(2)),
                globalWeight: Number((globalMemory?.weight || 1).toFixed(2)),
                finalWeight: Number(finalWeight.toFixed(2)),
                smartScore: Number(smartScore.toFixed(2))
            };
        });
        // ==========================================
        // 🏆 SORT
        // ==========================================
        return enriched.sort((a, b) => b.smartScore -
            a.smartScore);
    }
    // ==========================================
    // 🧠 GET DOMINANT STRATEGY
    // ==========================================
    static getDominantStrategy(history) {
        const ranking = this.getSmartRanking(history);
        return ranking[0] || null;
    }
    // ==========================================
    // 📊 SYSTEM INSIGHTS
    // ==========================================
    static getInsights(history) {
        const ranking = this.getSmartRanking(history);
        const dominant = ranking[0];
        const weakest = ranking[ranking.length - 1];
        return {
            dominantStrategy: dominant?.strategy || null,
            dominantScore: dominant?.smartScore || 0,
            weakestStrategy: weakest?.strategy || null,
            weakestScore: weakest?.smartScore || 0,
            totalStrategies: ranking.length,
            averageScore: ranking.length > 0
                ? Number((ranking.reduce((acc, item) => acc +
                    item.smartScore, 0)
                    /
                        ranking.length).toFixed(2))
                : 0
        };
    }
}
exports.LearningEngine = LearningEngine;
