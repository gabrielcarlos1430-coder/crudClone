"use strict";
// src/modules/auto-learning/feedback-learning.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackLearningEngine = void 0;
const learning_memory_1 = require("./learning.memory");
// ==========================================
// 🧠 FEEDBACK LEARNING ENGINE
// ==========================================
class FeedbackLearningEngine {
    // ==========================================
    // 💾 STORE PREDICTIONS
    // ==========================================
    static storePredictions(predictions) {
        this.predictions.push(...predictions);
        // mantém últimas 5000
        if (this.predictions.length > 5000) {
            this.predictions =
                this.predictions.slice(-5000);
        }
        console.log('🧠 Predictions armazenadas:', this.predictions.length);
    }
    // ==========================================
    // 🎯 PROCESS REAL DRAW
    // ==========================================
    static async processDraw(realNumber) {
        console.log('🎯 Processando feedback:', realNumber);
        const recentPredictions = this.predictions.slice(-200);
        let totalHits = 0;
        for (const prediction of recentPredictions) {
            let hits = 0;
            // ======================================
            // 🎯 EXACT MATCH
            // ======================================
            if (prediction.number ===
                realNumber) {
                hits = 5;
            }
            // ======================================
            // 🔢 PARTIAL MATCH
            // ======================================
            else {
                const predictionDigits = prediction.number.split('');
                const realDigits = realNumber.split('');
                hits =
                    predictionDigits.filter(d => realDigits.includes(d)).length;
            }
            // ======================================
            // 🧠 UPDATE LEARNING
            // ======================================
            await learning_memory_1.LearningMemory.update(prediction.strategy, hits);
            totalHits += hits;
        }
        console.log(`🚀 Feedback finalizado | Hits=${totalHits}`);
        return {
            success: true,
            analyzed: recentPredictions.length,
            totalHits
        };
    }
}
exports.FeedbackLearningEngine = FeedbackLearningEngine;
FeedbackLearningEngine.predictions = [];
