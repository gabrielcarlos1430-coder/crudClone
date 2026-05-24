"use strict";
// src/modules/neural/neural.agent.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuralAgent = void 0;
const neural_memory_1 = require("./neural.memory");
// ==========================================
// 🧠 NEURAL AGENT
// ==========================================
class NeuralAgent {
    constructor(name, state) {
        this.name = name;
        this.state = state;
        neural_memory_1.NeuralMemoryStore.init(name);
    }
    // ==========================================
    // 🧠 DECIDE
    // ==========================================
    decide() {
        const memory = neural_memory_1.NeuralMemoryStore
            .getAll()
            .find(m => m.agent ===
            this.name);
        const evolution = memory?.evolutionLevel || 1;
        // ==========================================
        // 🎯 CONFIDENCE
        // ==========================================
        const confidence = Number(((this.state.adaptation +
            this.state.stability) *
            evolution *
            10).toFixed(2));
        return {
            agent: this.name,
            confidence,
            evolution
        };
    }
    // ==========================================
    // 🚀 LEARN
    // ==========================================
    learn(success) {
        neural_memory_1.NeuralMemoryStore.update(this.name, success);
    }
}
exports.NeuralAgent = NeuralAgent;
