"use strict";
// src/modules/analytics/source-weight.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceWeightEngine = void 0;
// ==========================================
// 🧠 SOURCE WEIGHT ENGINE
// ==========================================
class SourceWeightEngine {
    // ==========================================
    // 🔍 GET WEIGHT
    // ==========================================
    static getWeight(source) {
        if (!source) {
            return 0.1;
        }
        return (this.weights[source]
            ?? 0.1);
    }
    // ==========================================
    // ✅ IS TRUSTED
    // ==========================================
    static isTrusted(source) {
        return this.getWeight(source) >= 0.7;
    }
    // ==========================================
    // 📋 GET ALL
    // ==========================================
    static getAll() {
        return Object.entries(this.weights).map(([source, weight]) => ({
            source,
            weight,
            trusted: weight >= 0.7
        }));
    }
    // ==========================================
    // 🧠 UPDATE WEIGHT
    // ==========================================
    static updateWeight(source, weight) {
        this.weights[source] =
            Math.max(0, Math.min(weight, 1));
    }
}
exports.SourceWeightEngine = SourceWeightEngine;
// ==========================================
// ⚖️ DEFAULT WEIGHTS
// ==========================================
SourceWeightEngine.weights = {
    // oficiais
    'mega-sena': 1.0,
    // semi-oficiais
    'federal': 0.8,
    // alternativos
    'bicho': 0.5,
    // IA
    'AI-HOT': 0.7,
    'AI-COLD': 0.4,
    'AI-RANDOM': 0.2
};
