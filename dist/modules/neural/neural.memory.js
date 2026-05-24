"use strict";
// src/modules/neural/neural.memory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuralMemoryStore = void 0;
// ==========================================
// 🧠 NEURAL MEMORY
// ==========================================
class NeuralMemoryStore {
    // ==========================================
    // 🚀 INIT
    // ==========================================
    static init(agent) {
        if (!this.memory.has(agent)) {
            this.memory.set(agent, {
                agent,
                experience: 0,
                wins: 0,
                failures: 0,
                evolutionLevel: 1
            });
        }
    }
    // ==========================================
    // 🧠 UPDATE
    // ==========================================
    static update(agent, success) {
        this.init(agent);
        const data = this.memory.get(agent);
        data.experience += 1;
        if (success) {
            data.wins += 1;
        }
        else {
            data.failures += 1;
        }
        // ==========================================
        // 🚀 EVOLUTION
        // ==========================================
        data.evolutionLevel =
            Number((1 +
                (data.wins /
                    Math.max(1, data.experience)) * 10).toFixed(2));
        this.memory.set(agent, data);
    }
    // ==========================================
    // 📋 GET
    // ==========================================
    static getAll() {
        return Array.from(this.memory.values());
    }
}
exports.NeuralMemoryStore = NeuralMemoryStore;
NeuralMemoryStore.memory = new Map();
