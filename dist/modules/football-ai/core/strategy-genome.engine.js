"use strict";
// src/modules/football-ai/core/strategy-genome.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyGenomeEngine = void 0;
// ======================================
// ENGINE
// ======================================
class StrategyGenomeEngine {
    static createRandom() {
        return {
            id: crypto.randomUUID(),
            name: `GEN-${Date.now()}`,
            weights: {
                offense: random(0.5, 3),
                defense: random(0.5, 3),
                momentum: random(0.5, 3),
                pressure: random(0.5, 3),
                chaos: random(0.5, 3),
                smartMoney: random(0.5, 3),
                emotional: random(0.5, 3)
            },
            accuracy: 50,
            profit: 0,
            survivalScore: 50,
            generation: 1,
            createdAt: new Date().toISOString()
        };
    }
}
exports.StrategyGenomeEngine = StrategyGenomeEngine;
// ======================================
// HELPERS
// ======================================
function random(min, max) {
    return Number((Math.random() *
        (max - min) +
        min).toFixed(2));
}
