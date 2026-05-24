"use strict";
// src/modules/analytics/frequency-analysis.engine.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrequencyAnalysisEngine = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
// ==========================================
// 🧠 FREQUENCY ANALYSIS ENGINE
// ==========================================
class FrequencyAnalysisEngine {
    // ==========================================
    // 📊 LOAD HISTORY
    // ==========================================
    static async loadHistory() {
        return prisma_1.default.drawHistory.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5000,
            select: {
                number: true,
                createdAt: true
            }
        });
    }
    // ==========================================
    // 🔥 HOT NUMBERS
    // ==========================================
    static async getHotNumbers(limit = 10) {
        const history = await this.loadHistory();
        const map = {};
        for (const item of history) {
            map[item.number] =
                (map[item.number] || 0) + 1;
        }
        return Object.entries(map)
            .map(([number, count]) => ({
            number,
            count,
            score: count * 10
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    // ==========================================
    // ❄️ COLD NUMBERS
    // ==========================================
    static async getColdNumbers(limit = 10) {
        const history = await this.loadHistory();
        const map = {};
        for (const item of history) {
            map[item.number] =
                (map[item.number] || 0) + 1;
        }
        return Object.entries(map)
            .map(([number, count]) => ({
            number,
            count,
            score: 100 - count
        }))
            .sort((a, b) => a.count - b.count)
            .slice(0, limit);
    }
    // ==========================================
    // 📈 TRENDING NUMBERS
    // ==========================================
    static async getTrendingNumbers(limit = 10) {
        const history = await this.loadHistory();
        const recent = history.slice(0, 1000);
        const old = history.slice(1000);
        const recentMap = {};
        const oldMap = {};
        for (const item of recent) {
            recentMap[item.number] =
                (recentMap[item.number] || 0) + 1;
        }
        for (const item of old) {
            oldMap[item.number] =
                (oldMap[item.number] || 0) + 1;
        }
        const trends = [];
        for (const number in recentMap) {
            const recentCount = recentMap[number] || 0;
            const oldCount = oldMap[number] || 0;
            const growth = recentCount - oldCount;
            trends.push({
                number,
                count: recentCount,
                score: growth
            });
        }
        return trends
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}
exports.FrequencyAnalysisEngine = FrequencyAnalysisEngine;
