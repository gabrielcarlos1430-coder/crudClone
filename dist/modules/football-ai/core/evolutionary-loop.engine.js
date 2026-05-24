"use strict";
// src/modules/football-ai/core/evolutionary-loop.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionaryLoopEngine = void 0;
const strategy_genome_engine_1 = require("./strategy-genome.engine");
const mutation_engine_1 = require("./mutation.engine");
const strategy_survival_engine_1 = require("./strategy-survival.engine");
// ======================================
// ENGINE
// ======================================
class EvolutionaryLoopEngine {
    // ======================================
    // EVOLVE
    // ======================================
    static evolve() {
        // ======================================
        // EVALUATE
        // ======================================
        this.population =
            this.population.map(genome => strategy_survival_engine_1.StrategySurvivalEngine
                .evaluate(genome));
        // ======================================
        // BEST
        // ======================================
        const best = strategy_survival_engine_1.StrategySurvivalEngine
            .selectBest(this.population);
        // ======================================
        // MUTATE
        // ======================================
        const mutated = best.map(genome => mutation_engine_1.MutationEngine
            .mutate(genome));
        // ======================================
        // NEXT GEN
        // ======================================
        this.population = [
            ...best,
            ...mutated
        ];
        return this.population;
    }
    // ======================================
    // GET BEST
    // ======================================
    static best() {
        return this.population
            .sort((a, b) => b.survivalScore -
            a.survivalScore)[0];
    }
}
exports.EvolutionaryLoopEngine = EvolutionaryLoopEngine;
EvolutionaryLoopEngine.population = Array.from({ length: 20 }, () => strategy_genome_engine_1.StrategyGenomeEngine
    .createRandom());
