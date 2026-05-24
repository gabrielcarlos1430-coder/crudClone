"use strict";
// src/modules/strategy-engine/strategy.score.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyScoreEngine = void 0;
// ==========================================
// 🧠 STRATEGY SCORE ENGINE
// ==========================================
class StrategyScoreEngine {
    // ==========================================
    // 🎯 DIVERSIDADE
    // ==========================================
    static calculateDiversity(generated) {
        const unique = new Set(generated.map(g => g.number));
        return Number((unique.size /
            generated.length
            * 100).toFixed(2));
    }
    // ==========================================
    // 🌍 COBERTURA
    // ==========================================
    static calculateCoverage(generated) {
        const prefixes = new Set(generated.map(g => g.number.slice(0, 2)));
        return Number((prefixes.size / 100
            * 100).toFixed(2));
    }
    // ==========================================
    // 🧠 SCORE FINAL
    // ==========================================
    static calculateFinalScore(accuracy, weight, diversity, coverage) {
        const score = (accuracy * 0.4) +
            (weight * 0.3) +
            (diversity * 0.2) +
            (coverage * 0.1);
        return Number(score.toFixed(2));
    }
    // ==========================================
    // 🚀 SCORE COMPLETO
    // ==========================================
    static evaluate(generated, accuracy, weight) {
        const diversity = this.calculateDiversity(generated);
        const coverage = this.calculateCoverage(generated);
        const finalScore = this.calculateFinalScore(accuracy, weight, diversity, coverage);
        return {
            accuracy,
            diversity,
            coverage,
            finalScore
        };
    }
}
exports.StrategyScoreEngine = StrategyScoreEngine;
