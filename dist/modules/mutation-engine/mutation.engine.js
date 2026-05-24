"use strict";
// src/modules/mutation-engine/mutation.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationEngine = void 0;
const learning_memory_1 = require("../auto-learning/learning.memory");
// ==========================================
// 🧬 STRATEGY MUTATION ENGINE
// ==========================================
class MutationEngine {
    // ==========================================
    // 🚀 CREATE MUTATION
    // ==========================================
    static createMutation() {
        const memory = learning_memory_1.LearningMemory.getAll();
        // ==========================================
        // 🏆 TOP STRATEGIES
        // ==========================================
        const top = [...memory]
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 2);
        if (top.length < 2) {
            return null;
        }
        // ==========================================
        // 🧬 PARENTS
        // ==========================================
        const parentA = top[0];
        const parentB = top[1];
        // ==========================================
        // 🧠 NEW NAME
        // ==========================================
        const name = `${parentA.name}-${parentB.name}-v${Date.now()}`;
        // ==========================================
        // 📊 SCORE
        // ==========================================
        const score = Number(((parentA.weight +
            parentB.weight) / 2).toFixed(2));
        // ==========================================
        // 🧬 MUTATION
        // ==========================================
        const mutation = {
            name,
            parents: [
                parentA.name,
                parentB.name
            ],
            generation: 1,
            score,
            status: 'testing',
            createdAt: new Date()
        };
        this.mutations.push(mutation);
        return mutation;
    }
    // ==========================================
    // 📋 GET ALL
    // ==========================================
    static getAll() {
        return this.mutations;
    }
    // ==========================================
    // 🏆 PROMOTE
    // ==========================================
    static promote(name) {
        const mutation = this.mutations.find(m => m.name === name);
        if (!mutation) {
            return null;
        }
        mutation.status =
            'active';
        return mutation;
    }
    // ==========================================
    // ☠️ FAIL
    // ==========================================
    static fail(name) {
        const mutation = this.mutations.find(m => m.name === name);
        if (!mutation) {
            return null;
        }
        mutation.status =
            'failed';
        return mutation;
    }
}
exports.MutationEngine = MutationEngine;
MutationEngine.mutations = [];
