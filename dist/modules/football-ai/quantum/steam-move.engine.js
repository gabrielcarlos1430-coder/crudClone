"use strict";
// src/modules/football-ai/quantum/steam-move.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamMoveEngine = void 0;
// ======================================
// 🚀 STEAM MOVE ENGINE (STABLE)
// ======================================
class SteamMoveEngine {
    static analyze() {
        // ======================================
        // 📊 INTENSIDADE CONTROLADA
        // ======================================
        const intensity = random(20, 95);
        // ======================================
        // 📈 DIREÇÃO COM PEQUENO PESO
        // ======================================
        const direction = weightedDirection();
        // ======================================
        // 💥 EXPLOSIVO (AJUSTADO)
        // ======================================
        const explosive = intensity >= 82;
        return {
            intensity,
            direction,
            explosive
        };
    }
}
exports.SteamMoveEngine = SteamMoveEngine;
// ======================================
// ⚖️ DIREÇÃO PONDERADA (EVITA RANDOM PURO)
// ======================================
function weightedDirection() {
    // leve tendência neutra (evita 50/50 puro)
    const bias = Math.random();
    if (bias > 0.52)
        return 'HOME';
    return 'AWAY';
}
// ======================================
// 🔧 RANDOM HELPER
// ======================================
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
