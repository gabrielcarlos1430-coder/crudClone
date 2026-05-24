"use strict";
// src/modules/strategy-engine/strategy.registry.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRegistry = void 0;
// ==========================================
// 🧩 REGISTRO CENTRAL
// ==========================================
class StrategyRegistry {
    // ==========================================
    // ➕ REGISTER
    // ==========================================
    static register(strategy) {
        const exists = this.strategies.find(s => s.name === strategy.name);
        if (exists) {
            return;
        }
        this.strategies.push(strategy);
    }
    // ==========================================
    // 📋 GET ALL
    // ==========================================
    static getAll() {
        return this.strategies;
    }
    // ==========================================
    // 🎯 GET ONE
    // ==========================================
    static get(name) {
        return this.strategies.find(s => s.name === name);
    }
    // ==========================================
    // 🪦 REMOVE
    // ==========================================
    static remove(name) {
        this.strategies =
            this.strategies.filter(s => s.name !== name);
    }
}
exports.StrategyRegistry = StrategyRegistry;
StrategyRegistry.strategies = [];
