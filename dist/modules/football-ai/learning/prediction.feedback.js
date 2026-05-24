"use strict";
// src/modules/football-ai/learning/prediction.feedback.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionFeedback = void 0;
const crypto_1 = __importDefault(require("crypto"));
const learning_memory_1 = require("./learning.memory");
// ======================================
// ENGINE
// ======================================
class PredictionFeedback {
    // ======================================
    // REGISTER RESULT
    // ======================================
    static register(prediction, realWinner, league = 'Unknown') {
        const result = prediction.winner === realWinner
            ? 'WIN'
            : 'LOSS';
        learning_memory_1.learningMemory.add({
            id: crypto_1.default.randomUUID(),
            match: `${prediction.homeTeam} vs ${prediction.awayTeam}`,
            league,
            prediction: prediction.winner,
            winner: realWinner,
            confidence: prediction.confidence,
            market: prediction.market,
            result,
            createdAt: new Date().toISOString()
        });
        return result;
    }
}
exports.PredictionFeedback = PredictionFeedback;
