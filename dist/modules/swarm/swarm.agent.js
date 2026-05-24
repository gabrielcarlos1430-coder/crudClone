"use strict";
// src/modules/swarm/swarm.agent.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwarmAgent = void 0;
// ==========================================
// 🧠 SWARM AGENT
// ==========================================
class SwarmAgent {
    constructor(data) {
        this.data = data;
    }
    // ==========================================
    // 🗳️ VOTE
    // ==========================================
    vote() {
        const vote = this.data.votes[Math.floor(Math.random() *
            this.data.votes.length)];
        return {
            strategy: vote.strategy,
            confidence: vote.confidence,
            weight: vote.weight *
                this.data.power
        };
    }
}
exports.SwarmAgent = SwarmAgent;
