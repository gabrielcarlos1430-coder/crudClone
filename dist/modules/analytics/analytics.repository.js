"use strict";
// src/modules/analytics/analytics.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
// ==========================================
// 📊 ANALYTICS REPOSITORY
// ==========================================
class AnalyticsRepository {
    // ==========================================
    // 📦 GET ALL DRAWS
    // ==========================================
    static async getAllDraws() {
        return prisma_1.default.drawHistory.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 10000
        });
    }
    // ==========================================
    // 📊 GET SOURCE STATS
    // ==========================================
    static async getSourceStats() {
        const draws = await this.getAllDraws();
        const stats = {};
        for (const draw of draws) {
            const source = draw.source || 'unknown';
            stats[source] =
                (stats[source] || 0) + 1;
        }
        return Object.entries(stats).map(([source, total]) => ({
            source,
            total
        }));
    }
    // ==========================================
    // 🔥 GET HOT NUMBERS
    // ==========================================
    static async getHotNumbers() {
        const draws = await this.getAllDraws();
        const frequency = {};
        for (const draw of draws) {
            frequency[draw.number] =
                (frequency[draw.number] || 0) + 1;
        }
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([number, total]) => ({
            number,
            total
        }));
    }
    // ==========================================
    // ❄️ GET COLD NUMBERS
    // ==========================================
    static async getColdNumbers() {
        const draws = await this.getAllDraws();
        const frequency = {};
        for (const draw of draws) {
            frequency[draw.number] =
                (frequency[draw.number] || 0) + 1;
        }
        return Object.entries(frequency)
            .sort((a, b) => a[1] - b[1])
            .slice(0, 20)
            .map(([number, total]) => ({
            number,
            total
        }));
    }
}
exports.AnalyticsRepository = AnalyticsRepository;
