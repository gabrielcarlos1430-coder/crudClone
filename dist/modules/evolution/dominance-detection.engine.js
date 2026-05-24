"use strict";
// src/modules/evolution/dominance-detection.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DominanceDetectionEngine = void 0;
const ai_species_engine_1 = require("./ai-species.engine");
const strategy_registry_1 = require("../strategy-engine/strategy.registry");
// ==========================================
// 🧠 DOMINANCE DETECTION ENGINE
// ==========================================
class DominanceDetectionEngine {
    // ==========================================
    // 🚀 ANALYZE DOMINANCE
    // ==========================================
    static analyze() {
        const ecosystem = ai_species_engine_1.AISpeciesEngine.analyze();
        const totalStrategies = strategy_registry_1.StrategyRegistry
            .getAll()
            .length;
        const alerts = [];
        // ==========================================
        // 🧬 ANALYZE SPECIES
        // ==========================================
        for (const species of ecosystem.species) {
            const share = totalStrategies > 0
                ? (species.population /
                    totalStrategies) * 100
                : 0;
            let severity = 'low';
            let action = 'stable';
            // ==========================================
            // ⚠️ MEDIUM DOMINANCE
            // ==========================================
            if (share >= 40) {
                severity =
                    'medium';
                action =
                    'monitor_population';
            }
            // ==========================================
            // 🚨 HIGH DOMINANCE
            // ==========================================
            if (share >= 60) {
                severity =
                    'high';
                action =
                    'apply_evolutionary_pressure';
            }
            // ==========================================
            // 📊 ALERT
            // ==========================================
            if (severity !== 'low') {
                alerts.push({
                    species: species.name,
                    populationShare: Number(share.toFixed(2)),
                    severity,
                    action
                });
            }
        }
        // ==========================================
        // 🧠 DIVERSITY SCORE
        // ==========================================
        const diversityScore = ecosystem.totalSpecies > 0
            ? Number((ecosystem.totalSpecies /
                totalStrategies)
                .toFixed(2)) * 100
            : 0;
        // ==========================================
        // 🌱 HEALTH STATUS
        // ==========================================
        const ecosystemHealthy = alerts.length === 0 &&
            diversityScore >= 30;
        // ==========================================
        // 👑 DOMINANT SPECIES
        // ==========================================
        const dominantSpecies = alerts
            .sort((a, b) => b.populationShare -
            a.populationShare)[0]
            ?.species;
        // ==========================================
        // 📊 FINAL
        // ==========================================
        return {
            ecosystemHealthy,
            dominantSpecies,
            alerts,
            totalStrategies,
            totalSpecies: ecosystem.totalSpecies,
            diversityScore
        };
    }
}
exports.DominanceDetectionEngine = DominanceDetectionEngine;
