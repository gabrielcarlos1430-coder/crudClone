"use strict";
// src/modules/feedback/feedback.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const feedback_engine_1 = require("./feedback.engine");
const feedback_memory_1 = require("./feedback.memory");
const learning_memory_1 = require("../auto-learning/learning.memory");
// ==========================================
// 🧠 FEEDBACK SERVICE
// ==========================================
class FeedbackService {
    // ==========================================
    // 🎯 MATCHES
    // ==========================================
    static calculateHits(generated, real) {
        return generated.filter(n => real.includes(n));
    }
    // ==========================================
    // 📊 PERFORMANCE
    // ==========================================
    static getPerformance(accuracy) {
        if (accuracy >= 80) {
            return 'excellent';
        }
        if (accuracy >= 60) {
            return 'great';
        }
        if (accuracy >= 40) {
            return 'good';
        }
        if (accuracy >= 20) {
            return 'medium';
        }
        return 'low';
    }
    // ==========================================
    // 🚀 PROCESS
    // ==========================================
    static async process(input) {
        const { generatedNumbers, realNumbers, strategy } = input;
        // ==========================================
        // 🎯 MATCHES
        // ==========================================
        const matched = this.calculateHits(generatedNumbers, realNumbers);
        const missed = generatedNumbers.filter(n => !realNumbers.includes(n));
        const hits = matched.length;
        // ==========================================
        // 📊 ACCURACY
        // ==========================================
        const accuracy = generatedNumbers.length > 0
            ? (hits /
                generatedNumbers.length) * 100
            : 0;
        // ==========================================
        // 📈 PERFORMANCE
        // ==========================================
        const performance = this.getPerformance(accuracy);
        // ==========================================
        // 💾 MEMORY
        // ==========================================
        await feedback_memory_1.FeedbackMemory.add({
            strategy,
            hits,
            accuracy,
            performance,
            matched,
            missed,
            source: 'manual',
            createdAt: new Date()
        });
        // ==========================================
        // 🧠 ENGINE
        // ==========================================
        await feedback_engine_1.FeedbackEngine.process({
            strategy,
            generatedNumbers,
            winningNumbers: realNumbers
        });
        // ==========================================
        // 🤖 LEARNING
        // ==========================================
        await learning_memory_1.LearningMemory.update(strategy, hits);
        // ==========================================
        // 💾 DATABASE LOG
        // ==========================================
        try {
            const feedbackLog = prisma_1.default.feedbackLog;
            if (feedbackLog) {
                await feedbackLog.create({
                    data: {
                        strategy,
                        hits,
                        accuracy,
                        generated: generatedNumbers,
                        real: realNumbers,
                        performance
                    }
                });
            }
        }
        catch (error) {
            console.log('🟡 feedbackLog ainda não existe');
        }
        // ==========================================
        // 🚀 RESULT
        // ==========================================
        return {
            hits,
            accuracy: Number(accuracy.toFixed(2)),
            matched,
            missed,
            performance
        };
    }
    // ==========================================
    // 📊 STATS
    // ==========================================
    static async getStats() {
        const all = await feedback_memory_1.FeedbackMemory.getAll();
        if (!all.length) {
            return {
                total: 0,
                averageAccuracy: 0,
                bestStrategy: null
            };
        }
        // ==========================================
        // 📊 AVERAGE
        // ==========================================
        const averageAccuracy = all.reduce((acc, item) => acc + item.accuracy, 0) / all.length;
        // ==========================================
        // 🏆 BEST STRATEGY
        // ==========================================
        const grouped = {};
        for (const item of all) {
            if (!grouped[item.strategy]) {
                grouped[item.strategy] = [];
            }
            grouped[item.strategy]
                .push(item.accuracy);
        }
        let bestStrategy = '';
        let bestAverage = 0;
        for (const strategy in grouped) {
            const avg = grouped[strategy]
                .reduce((a, b) => a + b, 0) /
                grouped[strategy].length;
            if (avg > bestAverage) {
                bestAverage = avg;
                bestStrategy = strategy;
            }
        }
        // ==========================================
        // 🚀 OUTPUT
        // ==========================================
        return {
            total: all.length,
            averageAccuracy: Number(averageAccuracy.toFixed(2)),
            bestStrategy,
            bestAverage: Number(bestAverage.toFixed(2))
        };
    }
}
exports.FeedbackService = FeedbackService;
