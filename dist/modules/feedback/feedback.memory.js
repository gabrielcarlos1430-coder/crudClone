"use strict";
// src/modules/feedback/feedback.memory.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackMemory = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
// ==========================================
// 🧠 FEEDBACK MEMORY
// ==========================================
class FeedbackMemory {
    // ==========================================
    // 🚀 INITIALIZE
    // ==========================================
    static async initialize() {
        try {
            // Prisma ainda pode não ter schema
            const feedbackModel = prisma_1.default.feedbackHistory;
            if (!feedbackModel) {
                console.log('🟡 feedbackHistory ainda não existe no Prisma');
                return;
            }
            const feedbacks = await feedbackModel.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5000
            });
            this.memory = feedbacks.map((item) => ({
                strategy: item.strategy,
                hits: item.hits,
                accuracy: item.accuracy,
                performance: item.performance || 'unknown',
                matched: item.matched || [],
                missed: item.missed || [],
                source: item.source || 'system',
                createdAt: item.createdAt
            }));
            console.log(`🧠 FeedbackMemory carregada: ${this.memory.length} feedbacks`);
        }
        catch (error) {
            console.error('🔴 Erro initialize FeedbackMemory:', error);
        }
    }
    // ==========================================
    // 💾 ADD
    // ==========================================
    static async add(feedback) {
        try {
            // RAM
            this.memory.unshift(feedback);
            // LIMIT
            if (this.memory.length > 5000) {
                this.memory =
                    this.memory.slice(0, 5000);
            }
            // Prisma ainda pode não existir
            const feedbackModel = prisma_1.default.feedbackHistory;
            if (feedbackModel) {
                await feedbackModel.create({
                    data: {
                        strategy: feedback.strategy,
                        hits: feedback.hits,
                        accuracy: feedback.accuracy,
                        performance: feedback.performance,
                        matched: feedback.matched,
                        missed: feedback.missed,
                        source: feedback.source,
                        createdAt: feedback.createdAt
                    }
                });
            }
            console.log('✅ Feedback salvo:', feedback.strategy);
        }
        catch (error) {
            console.error('🔴 Erro add FeedbackMemory:', error);
        }
    }
    // ==========================================
    // 📊 GET ALL
    // ==========================================
    static async getAll() {
        return this.memory;
    }
    // ==========================================
    // 📊 GET BY STRATEGY
    // ==========================================
    static async getByStrategy(strategy) {
        return this.memory.filter(item => item.strategy ===
            strategy);
    }
    // ==========================================
    // 🧹 CLEAR
    // ==========================================
    static clear() {
        this.memory = [];
    }
}
exports.FeedbackMemory = FeedbackMemory;
FeedbackMemory.memory = [];
