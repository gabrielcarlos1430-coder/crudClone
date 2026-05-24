"use strict";
// src/modules/strategy-engine/strategy.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyService = void 0;
const strategy_registry_1 = require("./strategy.registry");
const simulator_service_1 = require("../simulator/simulator.service");
// ==========================================
// 🧠 SERVICE CENTRAL DAS STRATEGIES
// ==========================================
class StrategyService {
    // ==========================================
    // 🔥 CONVERTE HISTORY LEGADO
    // ==========================================
    static normalizeHistory(history) {
        return history.map(number => ({
            number
        }));
    }
    // ==========================================
    // 🚀 RODA TODAS STRATEGIES
    // ==========================================
    static runAll(history) {
        const strategies = strategy_registry_1.StrategyRegistry.getAll();
        if (!history ||
            !Array.isArray(history)) {
            throw new Error('History inválido');
        }
        // 🔥 converte para novo formato
        const normalizedHistory = this.normalizeHistory(history);
        const context = {
            history: normalizedHistory
        };
        const results = strategies.map((strategy) => {
            const generated = strategy.execute(context);
            const simulation = simulator_service_1.SimulatorService.runSimulation(history, generated.map(g => g.number));
            return {
                strategy: strategy.name,
                generated,
                simulation
            };
        });
        return results;
    }
    // ==========================================
    // 🎯 RODA UMA STRATEGY
    // ==========================================
    static runOne(name, history) {
        if (!name) {
            throw new Error('Nome da strategy é obrigatório');
        }
        if (!history ||
            !Array.isArray(history)) {
            throw new Error('History inválido');
        }
        const strategy = strategy_registry_1.StrategyRegistry.get(name);
        if (!strategy) {
            throw new Error(`Strategy "${name}" não encontrada`);
        }
        // 🔥 converte formato legado
        const normalizedHistory = this.normalizeHistory(history);
        const context = {
            history: normalizedHistory
        };
        const generated = strategy.execute(context);
        const simulation = simulator_service_1.SimulatorService.runSimulation(history, generated.map(g => g.number));
        return {
            strategy: strategy.name,
            generated,
            simulation
        };
    }
}
exports.StrategyService = StrategyService;
