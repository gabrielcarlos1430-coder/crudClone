"use strict";
// src/modules/strategy-engine/temporal-weight.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalWeightEngine = void 0;
// ==========================================
// 🧠 TEMPORAL WEIGHT ENGINE
// ==========================================
class TemporalWeightEngine {
    // ==========================================
    // 🔑 KEY
    // ==========================================
    static key(strategy, hour) {
        return `${strategy}-${hour}`;
    }
    // ==========================================
    // 🚀 UPDATE
    // ==========================================
    static update(strategy, hits, hour) {
        const key = this.key(strategy, hour);
        if (!this.memory.has(key)) {
            this.memory.set(key, {
                strategy,
                hour,
                hits: 0,
                runs: 0,
                weight: 1
            });
        }
        const data = this.memory.get(key);
        data.runs += 1;
        data.hits += hits;
        // ==========================================
        // 🧠 PERFORMANCE
        // ==========================================
        const performance = data.hits /
            data.runs;
        // ==========================================
        // ⚖️ WEIGHT
        // ==========================================
        data.weight =
            Math.max(0.1, performance * 10);
        this.memory.set(key, data);
    }
    // ==========================================
    // 🔥 GET WEIGHT
    // ==========================================
    static getWeight(strategy, hour) {
        const key = this.key(strategy, hour);
        return (this.memory.get(key)
            ?.weight || 1);
    }
    // ==========================================
    // 📊 GET ALL
    // ==========================================
    static getAll() {
        return Array.from(this.memory.values());
    }
}
exports.TemporalWeightEngine = TemporalWeightEngine;
// ==========================================
// 🧠 MEMÓRIA TEMPORAL
// ==========================================
TemporalWeightEngine.memory = new Map();
