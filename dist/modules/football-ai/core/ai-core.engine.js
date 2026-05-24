"use strict";
// src/modules/football-ai/core/ai-core.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AICoreEngine = void 0;
const evolutionary_loop_engine_1 = require("./evolutionary-loop.engine");
const pattern_discovery_engine_1 = require("./pattern-discovery.engine");
// ======================================
// ENGINE
// ======================================
class AICoreEngine {
    static process() {
        // ======================================
        // EVOLVE AI
        // ======================================
        const population = evolutionary_loop_engine_1.EvolutionaryLoopEngine
            .evolve();
        // ======================================
        // PATTERNS
        // ======================================
        const patterns = pattern_discovery_engine_1.PatternDiscoveryEngine
            .analyze();
        // ======================================
        // BEST AI
        // ======================================
        const bestAI = evolutionary_loop_engine_1.EvolutionaryLoopEngine
            .best();
        return {
            bestAI,
            patterns,
            populationSize: population.length,
            evolvedAt: new Date().toISOString()
        };
    }
}
exports.AICoreEngine = AICoreEngine;
