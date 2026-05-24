"use strict";
// src/modules/football/football.odds.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballOddsEngine = void 0;
const football_prediction_engine_1 = require("./football.prediction.engine");
// ==========================================
// ⚽ ODDS ENGINE (REAL MODEL BASE)
// ==========================================
class FootballOddsEngine {
    // ==========================================
    // 🎯 NORMALIZA PROBABILIDADE (REALISTA)
    // ==========================================
    static normalizeProbability(confidence) {
        // proteção contra IA inflada
        const safe = Math.max(35, Math.min(confidence || 50, 90));
        // curva mais próxima de mercado real
        const curve = Math.pow(safe / 100, 1.2) * 100;
        // suavização (evita extremos)
        return Math.min(92, Math.max(38, curve));
    }
    // ==========================================
    // 📊 SINGLE
    // ==========================================
    static calculateSingle(prediction) {
        const probability = this.normalizeProbability(prediction.confidence);
        const fairOdd = Number((100 / probability).toFixed(2));
        const impliedProbability = Number(((1 / fairOdd) * 100).toFixed(2));
        // edge mais realista
        // (mercado sempre tem margem)
        const edge = Number((probability -
            impliedProbability).toFixed(2));
        // filtro mais conservador
        // (evita falso positivo)
        const valueBet = edge >= 7;
        return {
            homeTeam: prediction.homeTeam,
            awayTeam: prediction.awayTeam,
            winner: prediction.winner,
            probability: Number(probability.toFixed(2)),
            fairOdd,
            impliedProbability,
            edge,
            valueBet
        };
    }
    // ==========================================
    // 🚀 CALCULATE
    // ==========================================
    static calculate(matches) {
        const predictions = football_prediction_engine_1.FootballPredictionEngine.predict(matches);
        if (!predictions?.length) {
            return [];
        }
        return predictions
            .map(prediction => this.calculateSingle(prediction))
            .sort((a, b) => b.edge -
            a.edge);
    }
}
exports.FootballOddsEngine = FootballOddsEngine;
