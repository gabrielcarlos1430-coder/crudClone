"use strict";
// src/modules/football-ai/quantum/quantum-match.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantumMarketEngine = void 0;
const smart_money_tracker_1 = require("./smart-money-tracker");
const trap_detector_engine_1 = require("./trap-detector.engine");
const fake_favorite_engine_1 = require("./fake-favorite.engine");
const steam_move_engine_1 = require("./steam-move.engine");
// ======================================
// 🧠 QUANTUM MARKET ENGINE
// ======================================
class QuantumMarketEngine {
    // ======================================
    // SAFE
    // ======================================
    static clamp(value, min = 1, max = 100) {
        return Number(Math.max(min, Math.min(max, value)).toFixed(2));
    }
    // ======================================
    // ANALYZE
    // ======================================
    static analyze(prediction) {
        // ======================================
        // 💰 SMART MONEY
        // ======================================
        const smartMoney = smart_money_tracker_1.SmartMoneyTracker.analyze(prediction.winner);
        // ======================================
        // ⚠️ TRAP DETECTOR
        // ======================================
        const trap = trap_detector_engine_1.TrapDetectorEngine.analyze(prediction, smartMoney);
        // ======================================
        // 🎭 FAKE FAVORITE
        // ======================================
        const fakeFavorite = fake_favorite_engine_1.FakeFavoriteEngine.analyze(prediction);
        // ======================================
        // 🚀 STEAM MOVE
        // ======================================
        const steam = steam_move_engine_1.SteamMoveEngine.analyze();
        // ======================================
        // 🧮 BASE SCORE
        // ======================================
        let quantumScore = Number(prediction.confidence ?? 50);
        // ======================================
        // 💰 SMART MONEY
        // ======================================
        if (smartMoney?.suspicious) {
            quantumScore += 6;
        }
        // ======================================
        // ⚠️ TRAP
        // ======================================
        if (trap?.dangerous) {
            quantumScore -= 12;
        }
        // ======================================
        // 🚀 STEAM
        // ======================================
        if (steam?.explosive) {
            quantumScore += 8;
        }
        // ======================================
        // 🎭 FAKE FAVORITE
        // ======================================
        // ✅ CORRIGIDO:
        // fakeSignal ao invés de falseSignal
        if (fakeFavorite?.fakeSignal) {
            quantumScore -= 5;
        }
        // ======================================
        // 🧠 CHAOS CONTROL
        // ======================================
        if (prediction.chaosIndex >= 75) {
            quantumScore -= 7;
        }
        // ======================================
        // 🛡️ LOW RISK BOOST
        // ======================================
        if (prediction.risk <= 20) {
            quantumScore += 4;
        }
        // ======================================
        // 📊 NORMALIZE
        // ======================================
        quantumScore =
            this.clamp(quantumScore);
        // ======================================
        // 📈 MARKET DIRECTION
        // ======================================
        let marketDirection = 'NEUTRAL';
        if (quantumScore >= 75) {
            marketDirection =
                'BULLISH';
        }
        else if (quantumScore <= 45) {
            marketDirection =
                'BEARISH';
        }
        // ======================================
        // 🌪️ VOLATILITY
        // ======================================
        let volatility = 'MEDIUM';
        if (prediction.chaosIndex >= 80 ||
            steam?.explosive) {
            volatility =
                'HIGH';
        }
        else if (prediction.chaosIndex <= 35) {
            volatility =
                'LOW';
        }
        // ======================================
        // 🏁 RECOMMENDATION
        // ======================================
        let recommendation = 'RISKY';
        if (quantumScore >= 90) {
            recommendation =
                'ELITE';
        }
        else if (quantumScore >= 80) {
            recommendation =
                'STRONG';
        }
        else if (quantumScore >= 65) {
            recommendation =
                'GOOD';
        }
        else if (quantumScore < 45) {
            recommendation =
                'AVOID';
        }
        // ======================================
        // 🏁 RESULT
        // ======================================
        return {
            smartMoney,
            trap,
            fakeFavorite,
            steam,
            quantumScore,
            elite: quantumScore >= 85,
            strong: quantumScore >= 70,
            weak: quantumScore < 50,
            marketDirection,
            volatility,
            recommendation
        };
    }
    // ======================================
    // 🎯 MARKET PICK
    // ======================================
    static pickMarket(prediction) {
        return prediction.market;
    }
}
exports.QuantumMarketEngine = QuantumMarketEngine;
