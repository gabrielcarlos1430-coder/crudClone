"use strict";
// src/modules/consciousness/conscious.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsciousDecisionEngine = void 0;
const conscious_agent_1 = require("./conscious.agent");
// ==========================================
// 🧠 CONSCIOUS DECISION ENGINE
// ==========================================
class ConsciousDecisionEngine {
    // ==========================================
    // 🚀 RUN
    // ==========================================
    static run() {
        const thoughts = this.agents.map(a => a.think());
        // ==========================================
        // 🏆 DOMINANT THOUGHT
        // ==========================================
        const dominant = [...thoughts]
            .sort((a, b) => b.score - a.score)[0];
        // ==========================================
        // 🧠 EXPERIENCE LOOP
        // ==========================================
        for (const agent of this.agents) {
            agent.experience(Math.random() > 0.5);
        }
        return {
            totalAgents: this.agents.length,
            thoughts,
            dominantMind: dominant
        };
    }
}
exports.ConsciousDecisionEngine = ConsciousDecisionEngine;
ConsciousDecisionEngine.agents = [
    // ======================================
    // 🔥 DOMINANT AGENT
    // ======================================
    new conscious_agent_1.ConsciousAgent({
        name: 'DominantAI',
        desires: {
            dominance: 1,
            exploration: 0.3,
            stability: 0.8,
            cooperation: 0.4
        },
        emotions: {
            confidence: 0.9,
            fear: 0.2,
            ambition: 1,
            curiosity: 0.5
        }
    }),
    // ======================================
    // 🎲 CHAOS AGENT
    // ======================================
    new conscious_agent_1.ConsciousAgent({
        name: 'ChaosAI',
        desires: {
            dominance: 0.4,
            exploration: 1,
            stability: 0.1,
            cooperation: 0.2
        },
        emotions: {
            confidence: 0.5,
            fear: 0.1,
            ambition: 0.7,
            curiosity: 1
        }
    })
];
