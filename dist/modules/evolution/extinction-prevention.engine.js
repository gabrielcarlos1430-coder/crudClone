"use strict";
// src/modules/evolution/extinction-prevention.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtinctionPreventionEngine = void 0;
const ai_species_engine_1 = require("./ai-species.engine");
const dominance_detection_engine_1 = require("./dominance-detection.engine");
const strategy_registry_1 = require("../strategy-engine/strategy.registry");
// ==========================================
// 🧠 EXTINCTION PREVENTION ENGINE
// ==========================================
class ExtinctionPreventionEngine {
    // ==========================================
    // 🚀 ANALYZE ECOSYSTEM
    // ==========================================
    static analyze() {
        const ecosystem = ai_species_engine_1.AISpeciesEngine.analyze();
        const dominance = dominance_detection_engine_1.DominanceDetectionEngine
            .analyze();
        const totalStrategies = strategy_registry_1.StrategyRegistry
            .getAll()
            .length;
        const protectedSpecies = [];
        const actions = [];
        // ==========================================
        // 🌱 CHECK SPECIES RISK
        // ==========================================
        for (const species of ecosystem.species) {
            const populationShare = totalStrategies > 0
                ? (species.population /
                    totalStrategies) * 100
                : 0;
            let risk = 'low';
            let action = 'none';
            let boost = 1;
            // ==========================================
            // 🚨 HIGH RISK
            // ==========================================
            if (populationShare <= 10) {
                risk =
                    'high';
                action =
                    'forced_mutation_boost';
                boost =
                    3;
            }
            // ==========================================
            // ⚠️ MEDIUM RISK
            // ==========================================
            else if (populationShare <= 20) {
                risk =
                    'medium';
                action =
                    'reproduction_boost';
                boost =
                    2;
            }
            // ==========================================
            // 🌱 PROTECTION
            // ==========================================
            if (risk !== 'low') {
                protectedSpecies.push({
                    species: species.name,
                    population: species.population,
                    risk,
                    action,
                    boost
                });
                actions.push(`${species.name}:${action}`);
            }
        }
        // ==========================================
        // 🧠 STABILITY SCORE
        // ==========================================
        let ecosystemStability = 100;
        // 🚨 penalidade por dominância
        if (dominance.alerts.length > 0) {
            ecosystemStability -=
                dominance.alerts.length * 15;
        }
        // 🚨 penalidade por extinção
        ecosystemStability -=
            protectedSpecies.length * 10;
        // ==========================================
        // 🔒 LIMITS
        // ==========================================
        ecosystemStability = Math.max(0, ecosystemStability);
        // ==========================================
        // 📊 FINAL
        // ==========================================
        return {
            protectedSpecies,
            extinctRiskCount: protectedSpecies.length,
            ecosystemStability,
            actions
        };
    }
}
exports.ExtinctionPreventionEngine = ExtinctionPreventionEngine;
