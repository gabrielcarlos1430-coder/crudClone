"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
class AnalyticsController {
    // ==========================================
    // 🔥 ANALYZE
    // ==========================================
    static analyze(req, res) {
        const { numbers } = req.body;
        if (!numbers ||
            !Array.isArray(numbers)) {
            return res.status(400).json({
                error: 'numbers deve ser um array'
            });
        }
        const result = analytics_service_1.AnalyticsService.getStats(numbers);
        return res.json(result);
    }
    // ==========================================
    // 🔥 HOT DATABASE
    // ==========================================
    static async hot(req, res) {
        const result = await analytics_service_1.AnalyticsService
            .getDatabaseHotNumbers();
        return res.json(result);
    }
    // ==========================================
    // ❄️ COLD DATABASE
    // ==========================================
    static async cold(req, res) {
        const result = await analytics_service_1.AnalyticsService
            .getDatabaseColdNumbers();
        return res.json(result);
    }
    // ==========================================
    // 📦 SOURCES
    // ==========================================
    static async sources(req, res) {
        const result = await analytics_service_1.AnalyticsService
            .getSourceStats();
        return res.json(result);
    }
}
exports.AnalyticsController = AnalyticsController;
