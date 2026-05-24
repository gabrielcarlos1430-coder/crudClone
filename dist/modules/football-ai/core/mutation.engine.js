"use strict";
// src/modules/football-ai/core/mutation.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationEngine = void 0;
// ======================================
// ENGINE
// ======================================
class MutationEngine {
    static mutate(genome) {
        const clone = structuredClone(genome);
        clone.id =
            crypto.randomUUID();
        clone.generation += 1;
        // ======================================
        // RANDOM MUTATIONS
        // ======================================
        for (const key of Object.keys(clone.weights)) {
            const mutation = Number(((Math.random() - 0.5) *
                0.6).toFixed(2));
            clone.weights[key] += mutation;
        }
        clone.createdAt =
            new Date().toISOString();
        return clone;
    }
}
exports.MutationEngine = MutationEngine;
