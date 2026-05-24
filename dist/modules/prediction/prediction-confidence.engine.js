"use strict";
// src/modules/prediction/prediction-confidence.engine.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionConfidenceEngine = void 0;
const learning_memory_1 = require("../auto-learning/learning.memory");
const temporal_weight_engine_1 = require("../strategy-engine/temporal-weight.engine");
const recency_analysis_engine_1 = require("../analytics/recency-analysis.engine");
const prisma_1 = __importDefault(require("../../database/prisma"));
// ==========================================
// 🧠 PREDICTION CONFIDENCE ENGINE
// ==========================================
class PredictionConfidenceEngine {
    // ==========================================
    // 🚀 LOAD DATABASE ANALYTICS
    // ==========================================
    static async loadFrequencyCache() {
        const now = Date.now();
        // cache 30s
        if (now - this.lastCacheUpdate <
            30000) {
            return;
        }
        console.log('🧠 Atualizando Frequency Cache...');
        const draws = await prisma_1.default.drawHistory.findMany({
            select: {
                number: true
            },
            take: 10000,
            orderBy: {
                createdAt: 'desc'
            }
        });
        const map = {};
        for (const draw of draws) {
            map[draw.number] =
                (map[draw.number] || 0) + 1;
        }
        this.frequencyCache = map;
        this.lastCacheUpdate = now;
        console.log('✅ Frequency Cache atualizado:', Object.keys(map).length, 'números');
    }
    // ==========================================
    // 📊 FREQUENCY SCORE
    // ==========================================
    static getFrequencyScore(number) {
        const occurrences = this.frequencyCache[number] || 0;
        const maxFrequency = Math.max(...Object.values(this.frequencyCache), 1);
        return (occurrences / maxFrequency) * 100;
    }
    // ==========================================
    // 🚀 CALCULATE
    // ==========================================
    static async calculate(number, history, strategy) {
        // ==========================================
        // 🧠 LOAD REAL CACHE
        // ==========================================
        await this.loadFrequencyCache();
        // ==========================================
        // 📊 REAL FREQUENCY
        // ==========================================
        const frequency = this.getFrequencyScore(number);
        // ==========================================
        // 🧠 LEARNING
        // ==========================================
        const memory = learning_memory_1.LearningMemory
            .getAll()
            .find(m => m.name === strategy);
        const learning = (memory?.weight || 1) * 10;
        // ==========================================
        // 🕒 TEMPORAL
        // ==========================================
        const currentHour = new Date().getHours();
        const temporal = temporal_weight_engine_1.TemporalWeightEngine.getWeight(strategy, currentHour) * 10;
        // ==========================================
        // 🎲 DIVERSITY
        // ==========================================
        const uniqueDigits = new Set(number.split('')).size;
        const diversity = (uniqueDigits / 4) * 100;
        // ==========================================
        // 🕒 REAL RECENCY
        // ==========================================
        const recency = await recency_analysis_engine_1.RecencyAnalysisEngine
            .getRecencyScore(number);
        // ==========================================
        // 📈 REAL TREND
        // ==========================================
        const trend = await recency_analysis_engine_1.RecencyAnalysisEngine
            .getTrendScore(number);
        // ==========================================
        // 📊 FINAL SCORE
        // ==========================================
        const confidence = (frequency * 0.30) +
            (learning * 0.20) +
            (temporal * 0.10) +
            (diversity * 0.10) +
            (recency * 0.15) +
            (trend * 0.15);
        return {
            number,
            confidence: Number(confidence.toFixed(2)),
            factors: {
                frequency: Number(frequency.toFixed(2)),
                temporal: Number(temporal.toFixed(2)),
                learning: Number(learning.toFixed(2)),
                diversity: Number(diversity.toFixed(2)),
                recency: Number(recency.toFixed(2)),
                trend: Number(trend.toFixed(2))
            }
        };
    }
}
exports.PredictionConfidenceEngine = PredictionConfidenceEngine;
// ==========================================
// 📊 CACHE
// ==========================================
PredictionConfidenceEngine.frequencyCache = {};
PredictionConfidenceEngine.lastCacheUpdate = 0;
