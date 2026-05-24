"use strict";
// src/modules/evolution/ai-species.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISpeciesEngine = void 0;
const strategy_registry_1 = require("../strategy-engine/strategy.registry");
// ==========================================
// 🧠 AI SPECIES ENGINE
// ==========================================
class AISpeciesEngine {
    // ==========================================
    // 🚀 ANALYZE ECOSYSTEM
    // ==========================================
    static analyze() {
        const strategies = strategy_registry_1.StrategyRegistry.getAll();
        const grouped = new Map();
        // ==========================================
        // 🧬 GROUP BY SPECIES
        // ==========================================
        for (const strategy of strategies) {
            const species = strategy.lineage?.species ||
                this.detectSpecies(strategy.name);
            if (!grouped.has(species)) {
                grouped.set(species, []);
            }
            grouped
                .get(species)
                .push(strategy);
        }
        // ==========================================
        // 📊 BUILD REPORT
        // ==========================================
        const speciesList = [];
        for (const [name, items] of grouped.entries()) {
            const population = items.length;
            const generations = items.map(s => s.lineage?.generation || 1);
            const averageGeneration = generations.reduce((a, b) => a + b, 0) / generations.length;
            speciesList.push({
                name,
                population,
                averageGeneration: Number(averageGeneration
                    .toFixed(2)),
                strategies: items.map(s => s.name),
                dominant: population >= 5,
                extinctRisk: population <= 1
            });
        }
        // ==========================================
        // 👑 DOMINANT
        // ==========================================
        speciesList.sort((a, b) => b.population -
            a.population);
        const dominant = speciesList[0];
        // ==========================================
        // ⚠️ ENDANGERED
        // ==========================================
        const endangered = speciesList
            .filter(s => s.extinctRisk)
            .map(s => s.name);
        // ==========================================
        // 📊 FINAL
        // ==========================================
        return {
            totalSpecies: speciesList.length,
            dominantSpecies: dominant?.name,
            endangeredSpecies: endangered,
            species: speciesList
        };
    }
    // ==========================================
    // 🧠 DETECT SPECIES
    // ==========================================
    static detectSpecies(name) {
        const lower = name.toLowerCase();
        if (lower.includes('hot')) {
            return 'hot-family';
        }
        if (lower.includes('cold')) {
            return 'cold-family';
        }
        if (lower.includes('cluster')) {
            return 'cluster-family';
        }
        if (lower.includes('random')) {
            return 'random-family';
        }
        if (lower.includes('hybrid')) {
            return 'hybrid-family';
        }
        if (lower.includes('mutation')) {
            return 'mutation-family';
        }
        return 'unknown-family';
    }
}
exports.AISpeciesEngine = AISpeciesEngine;
