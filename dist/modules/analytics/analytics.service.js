"use strict";
// src/modules/analytics/analytics.service.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
// ==========================================
// 📊 ANALYTICS ENGINE
// ==========================================
class AnalyticsService {
    // ==========================================
    // 🔥 FREQUÊNCIA
    // ==========================================
    static calculateFrequency(numbers) {
        const map = new Map();
        for (const num of numbers) {
            map.set(num, (map.get(num) || 0) + 1);
        }
        const total = numbers.length;
        return Array
            .from(map.entries())
            .map(([number, count]) => ({
            number,
            count,
            percentage: Number(((count / total) * 100).toFixed(2))
        }))
            .sort((a, b) => b.count - a.count);
    }
    // ==========================================
    // ⏳ ATRASO
    // ==========================================
    static calculateDelay(numbers) {
        const lastSeen = new Map();
        numbers.forEach((num, index) => {
            lastSeen.set(num, index);
        });
        return Array
            .from(lastSeen.entries())
            .map(([number, lastIndex]) => ({
            number,
            delay: numbers.length - lastIndex
        }))
            .sort((a, b) => b.delay - a.delay);
    }
    // ==========================================
    // 🔥 NÚMEROS QUENTES
    // ==========================================
    static calculateHotNumbers(frequency) {
        return frequency
            .slice(0, 20)
            .map(item => ({
            number: item.number,
            score: Number((item.percentage * 2).toFixed(2))
        }));
    }
    // ==========================================
    // ❄️ NÚMEROS FRIOS
    // ==========================================
    static calculateColdNumbers(delay) {
        return delay
            .slice(0, 20)
            .map(item => ({
            number: item.number,
            score: item.delay
        }));
    }
    // ==========================================
    // 🚀 RESULTADO FINAL
    // ==========================================
    static getStats(numbers) {
        const frequency = this.calculateFrequency(numbers);
        const delay = this.calculateDelay(numbers);
        const hotNumbers = this.calculateHotNumbers(frequency);
        const coldNumbers = this.calculateColdNumbers(delay);
        return {
            total: numbers.length,
            unique: new Set(numbers).size,
            frequency,
            delay,
            hotNumbers,
            coldNumbers
        };
    }
    // ==========================================
    // 📦 SOURCE STATS
    // ==========================================
    static async getSourceStats() {
        const { AnalyticsRepository } = await Promise.resolve().then(() => __importStar(require('./analytics.repository')));
        const sources = await AnalyticsRepository
            .getSourceStats();
        return {
            success: true,
            total: sources.length,
            sources
        };
    }
    // ==========================================
    // 🔥 DATABASE HOT
    // ==========================================
    static async getDatabaseHotNumbers() {
        const { AnalyticsRepository } = await Promise.resolve().then(() => __importStar(require('./analytics.repository')));
        const numbers = await AnalyticsRepository
            .getHotNumbers();
        return {
            success: true,
            total: numbers.length,
            numbers
        };
    }
    // ==========================================
    // ❄️ DATABASE COLD
    // ==========================================
    static async getDatabaseColdNumbers() {
        const { AnalyticsRepository } = await Promise.resolve().then(() => __importStar(require('./analytics.repository')));
        const numbers = await AnalyticsRepository
            .getColdNumbers();
        return {
            success: true,
            total: numbers.length,
            numbers
        };
    }
}
exports.AnalyticsService = AnalyticsService;
