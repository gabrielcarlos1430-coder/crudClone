"use strict";
// src/modules/evolution/ecosystem-balancer.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcosystemBalancerEngine = void 0;
const dominance_detection_engine_1 = require("./dominance-detection.engine");
const extinction_prevention_engine_1 = require("./extinction-prevention.engine");
const learning_memory_1 = require("../auto-learning/learning.memory");
// ==========================================
// 🌎 ECOSYSTEM BALANCER ENGINE
// ==========================================
class EcosystemBalancerEngine {
    // ==========================================
    // 🚀 MAIN BALANCE
    // ==========================================
    static balance() {
        const dominance = dominance_detection_engine_1.DominanceDetectionEngine
            .analyze();
        const extinction = extinction_prevention_engine_1.ExtinctionPreventionEngine
            .analyze();
        const actions = [];
        // ==========================================
        // 👑 HANDLE DOMINANCE
        // ==========================================
        for (const alert of dominance.alerts) {
            actions.push({
                target: alert.species,
                type: 'nerf',
                intensity: alert.severity === 'high'
                    ? 0.5
                    : 0.2,
                reason: 'species_dominance'
            });
            // 🔥 aplica redução
            this.adjustSpeciesWeight(alert.species, alert.severity === 'high'
                ? -0.5
                : -0.2);
        }
        // ==========================================
        // 🌱 HANDLE EXTINCTION
        // ==========================================
        for (const species of extinction
            .protectedSpecies) {
            actions.push({
                target: species.species,
                type: 'boost',
                intensity: species.boost,
                reason: 'extinction_prevention'
            });
            // 🔥 aplica boost
            this.adjustSpeciesWeight(species.species, species.boost);
        }
        // ==========================================
        // 🧬 MUTATION PRESSURE
        // ==========================================
        const mutationPressure = this.calculateMutationPressure(dominance.diversityScore, extinction.ecosystemStability);
        // ==========================================
        // 🧠 ECOSYSTEM HEALTH
        // ==========================================
        const ecosystemHealthy = dominance.ecosystemHealthy &&
            extinction.ecosystemStability >= 60;
        // ==========================================
        // 📊 FINAL
        // ==========================================
        return {
            stability: extinction.ecosystemStability,
            actions,
            ecosystemHealthy,
            mutationPressure,
            diversityIndex: dominance.diversityScore
        };
    }
    // ==========================================
    // 🧠 ADJUST SPECIES WEIGHT
    // ==========================================
    static adjustSpeciesWeight(species, amount) {
        const memory = learning_memory_1.LearningMemory.getAll();
        for (const item of memory) {
            if (item.name.includes(species)) {
                item.weight =
                    Math.max(0.1, item.weight + amount);
            }
        }
    }
    // ==========================================
    // 🧬 MUTATION PRESSURE
    // ==========================================
    static calculateMutationPressure(diversity, stability) {
        let pressure = 1;
        // baixa diversidade
        if (diversity < 30) {
            pressure += 1.5;
        }
        // baixa estabilidade
        if (stability < 50) {
            pressure += 2;
        }
        return Number(pressure.toFixed(2));
    }
}
exports.EcosystemBalancerEngine = EcosystemBalancerEngine;
