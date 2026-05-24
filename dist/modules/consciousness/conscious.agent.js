"use strict";
// src/modules/consciousness/conscious.agent.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsciousAgent = void 0;
const conscious_memory_1 = require("./conscious.memory");
// ==========================================
// 🧠 CONSCIOUS AGENT
// ==========================================
class ConsciousAgent {
    constructor(profile) {
        this.profile = profile;
        conscious_memory_1.ConsciousMemoryStore.init(profile.name);
    }
    // ==========================================
    // 🧠 THINK
    // ==========================================
    think() {
        const memory = conscious_memory_1.ConsciousMemoryStore
            .getAll()
            .find(m => m.agent ===
            this.profile.name);
        const mood = memory?.mood ||
            'neutral';
        // ==========================================
        // 🎯 PRIORITY SCORE
        // ==========================================
        let score = (this.profile.desires
            .dominance +
            this.profile.emotions
                .ambition +
            this.profile.emotions
                .confidence) * 10;
        // ==========================================
        // 😨 FEAR EFFECT
        // ==========================================
        if (mood === 'fearful') {
            score *= 0.7;
        }
        // ==========================================
        // 🚀 CONFIDENT EFFECT
        // ==========================================
        if (mood === 'confident') {
            score *= 1.2;
        }
        return {
            agent: this.profile.name,
            mood,
            score: Number(score.toFixed(2))
        };
    }
    // ==========================================
    // 🧠 EXPERIENCE
    // ==========================================
    experience(success) {
        conscious_memory_1.ConsciousMemoryStore.update(this.profile.name, success);
    }
}
exports.ConsciousAgent = ConsciousAgent;
