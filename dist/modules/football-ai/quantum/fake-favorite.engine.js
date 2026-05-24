"use strict";
// src/modules/football-ai/quantum/fake-favorite.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeFavoriteEngine = void 0;
// ======================================
// 🧠 FAKE FAVORITE ENGINE (STABLE)
// ======================================
class FakeFavoriteEngine {
    static analyze(prediction) {
        let score = 0;
        // ======================================
        // 📉 BAIXA CONFIANÇA EM FAVORITO
        // ======================================
        if (prediction.confidence < 65) {
            score += 30;
        }
        if (prediction.confidence < 55) {
            score += 15;
        }
        // ======================================
        // 💰 ODD MUITO BAIXA (FAVORITO FORÇADO)
        // ======================================
        if (prediction.fairOdd < 1.8) {
            score += 25;
        }
        if (prediction.fairOdd < 1.5) {
            score += 15;
        }
        // ======================================
        // ⚖️ EDGE SUSPEITO
        // ======================================
        if (prediction.edge < 3) {
            score += 10;
        }
        if (prediction.edge < 0) {
            score += 10;
        }
        // ======================================
        // 🚨 RESULTADO FINAL
        // ======================================
        const fakeSignal = score >= 40;
        return {
            fakeSignal,
            score,
            dangerLevel: fakeSignal ? 'HIGH' : 'LOW'
        };
    }
}
exports.FakeFavoriteEngine = FakeFavoriteEngine;
