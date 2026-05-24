"use strict";
// src/modules/consciousness/conscious.memory.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsciousMemoryStore = void 0;
// ==========================================
// 🧠 CONSCIOUS MEMORY
// ==========================================
class ConsciousMemoryStore {
    // ==========================================
    // 🚀 INIT
    // ==========================================
    static init(agent) {
        if (!this.memory.has(agent)) {
            this.memory.set(agent, {
                agent,
                wins: 0,
                failures: 0,
                mood: 'neutral'
            });
        }
    }
    // ==========================================
    // 🧠 UPDATE
    // ==========================================
    static update(agent, success) {
        this.init(agent);
        const data = this.memory.get(agent);
        if (success) {
            data.wins += 1;
        }
        else {
            data.failures += 1;
        }
        // ==========================================
        // 😊 MOOD
        // ==========================================
        if (data.wins >
            data.failures) {
            data.mood =
                'confident';
        }
        else if (data.failures >
            data.wins) {
            data.mood =
                'fearful';
        }
        else {
            data.mood =
                'neutral';
        }
        this.memory.set(agent, data);
    }
    // ==========================================
    // 📋 GET
    // ==========================================
    static getAll() {
        return Array.from(this.memory.values());
    }
}
exports.ConsciousMemoryStore = ConsciousMemoryStore;
ConsciousMemoryStore.memory = new Map();
