"use strict";
// src/modules/football-ai/quantum/trap-detector.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrapDetectorEngine = void 0;
// ======================================
// 🧠 TRAP DETECTOR ENGINE (STABLE)
// ======================================
class TrapDetectorEngine {
    static analyze(prediction, smartMoney) {
        let trapScore = 0;
        // ======================================
        // 📉 LOW CONFIDENCE ZONE
        // ======================================
        if (prediction.confidence < 60) {
            trapScore += 20;
        }
        if (prediction.confidence < 50) {
            trapScore += 10;
        }
        // ======================================
        // 💰 SMART MONEY WARNING
        // ======================================
        if (smartMoney.suspicious) {
            trapScore += 35;
        }
        if (smartMoney.institutionalPressure >= 85) {
            trapScore += 10;
        }
        // ======================================
        // ⚖️ MARKET EDGE FRACO
        // ======================================
        if (prediction.edge < 5) {
            trapScore += 15;
        }
        if (prediction.edge < 0) {
            trapScore += 10;
        }
        // ======================================
        // 🎯 EDGE MUITO ALTO (SINAL ARTIFICIAL)
        // ======================================
        if (prediction.edge > 30) {
            trapScore += 10;
        }
        // ======================================
        // 🚨 RESULTADO FINAL
        // ======================================
        const dangerous = trapScore >= 55;
        return {
            trapScore,
            dangerous
        };
    }
}
exports.TrapDetectorEngine = TrapDetectorEngine;
