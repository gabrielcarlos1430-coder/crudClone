"use strict";
// src/modules/evolution/evolution-pressure.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionPressureEngine = void 0;
const ecosystem_balancer_engine_1 = require("./ecosystem-balancer.engine");
const learning_memory_1 = require("../auto-learning/learning.memory");
// ==========================================
// 🚀 EVOLUTION PRESSURE ENGINE
// ==========================================
class EvolutionPressureEngine {
    // ==========================================
    // 🚀 MAIN ANALYSIS
    // ==========================================
    static analyze() {
        const ecosystem = ecosystem_balancer_engine_1.EcosystemBalancerEngine
            .balance();
        const memory = learning_memory_1.LearningMemory.getAll();
        const targets = [];
        let stagnationDetected = false;
        // ==========================================
        // 📊 GLOBAL PRESSURE
        // ==========================================
        let globalPressure = ecosystem.mutationPressure;
        // ==========================================
        // 🧠 STRATEGY ANALYSIS
        // ==========================================
        for (const strategy of memory) {
            const efficiency = strategy.runs > 0
                ? strategy.hits /
                    strategy.runs
                : 0;
            let pressure = 1;
            let mutationBoost = 1;
            let crossoverBoost = 1;
            let risk = 'low';
            // ==========================================
            // 🚨 STAGNATION
            // ==========================================
            if (efficiency < 0.3) {
                pressure += 2;
                mutationBoost += 1.5;
                crossoverBoost += 1;
                risk = 'high';
                stagnationDetected = true;
            }
            // ==========================================
            // ⚠️ LOW PERFORMANCE
            // ==========================================
            else if (efficiency < 0.6) {
                pressure += 1;
                mutationBoost += 0.5;
                crossoverBoost += 0.5;
                risk = 'medium';
            }
            // ==========================================
            // 📊 TARGET
            // ==========================================
            targets.push({
                strategy: strategy.name,
                currentWeight: strategy.weight,
                pressure,
                mutationBoost,
                crossoverBoost,
                risk
            });
            // ==========================================
            // 🌎 GLOBAL PRESSURE
            // ==========================================
            globalPressure +=
                pressure * 0.1;
        }
        // ==========================================
        // 🧬 FINAL RATES
        // ==========================================
        const mutationRate = Number((globalPressure * 1.2).toFixed(2));
        const crossoverRate = Number((globalPressure * 0.8).toFixed(2));
        // ==========================================
        // 🌎 ECOSYSTEM STATE
        // ==========================================
        let ecosystemState = 'stable';
        if (globalPressure >= 3) {
            ecosystemState =
                'adaptive';
        }
        if (globalPressure >= 5) {
            ecosystemState =
                'critical';
        }
        // ==========================================
        // 📊 FINAL
        // ==========================================
        return {
            globalPressure: Number(globalPressure
                .toFixed(2)),
            mutationRate,
            crossoverRate,
            stagnationDetected,
            targets,
            ecosystemState
        };
    }
}
exports.EvolutionPressureEngine = EvolutionPressureEngine;
