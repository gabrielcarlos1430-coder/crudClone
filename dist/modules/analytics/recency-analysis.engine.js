"use strict";
// src/modules/analytics/recency-analysis.engine.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecencyAnalysisEngine = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
// ==========================================
// 🧠 RECENCY ANALYSIS ENGINE
// ==========================================
class RecencyAnalysisEngine {
    // ==========================================
    // 📊 RECENCY SCORE
    // ==========================================
    static async getRecencyScore(number) {
        const history = await prisma_1.default.drawHistory.findMany({
            where: {
                number
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 30
        });
        if (!history.length) {
            return 0;
        }
        const latest = history[0];
        const now = Date.now();
        const drawTime = new Date(latest.createdAt).getTime();
        const diffMinutes = (now - drawTime) /
            (1000 * 60);
        // ==========================================
        // 🎯 RECENCY SCORE
        // ==========================================
        const score = Math.max(0, 100 - diffMinutes);
        return Number(score.toFixed(2));
    }
    // ==========================================
    // 📈 TREND SCORE
    // ==========================================
    static async getTrendScore(number) {
        const recent = await prisma_1.default.drawHistory.count({
            where: {
                number,
                createdAt: {
                    gte: new Date(Date.now() -
                        1000 * 60 * 60)
                }
            }
        });
        const old = await prisma_1.default.drawHistory.count({
            where: {
                number,
                createdAt: {
                    lt: new Date(Date.now() -
                        1000 * 60 * 60)
                }
            }
        });
        const score = recent - old;
        return Number(score.toFixed(2));
    }
}
exports.RecencyAnalysisEngine = RecencyAnalysisEngine;
