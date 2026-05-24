"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballController = void 0;
const football_provider_1 = require("./football.provider");
const football_analytics_1 = require("./football.analytics");
const football_prediction_engine_1 = require("./football.prediction.engine");
const football_odds_engine_1 = require("./football.odds.engine");
const football_realtime_1 = require("./football.realtime");
class FootballController {
    static async live(req, res) {
        try {
            const snapshot = football_realtime_1.FootballRealtime.getSnapshot();
            if (snapshot) {
                return res.json(snapshot);
            }
            const result = await football_provider_1.FootballProvider.getLiveMatches();
            return res.json(result);
        }
        catch (error) {
            console.error('FOOTBALL LIVE ERROR:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro ao carregar partidas'
            });
        }
    }
    static async analytics(req, res) {
        try {
            const result = await football_provider_1.FootballProvider.getLiveMatches();
            const matches = result.matches || [];
            const analytics = football_analytics_1.FootballAnalytics.analyze(matches);
            return res.json({
                success: true,
                totalMatches: matches.length,
                analytics,
                topTeams: analytics.slice(0, 10),
                hottestTeam: analytics[0] || null
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro analytics'
            });
        }
    }
    static async predictions(req, res) {
        try {
            const result = await football_provider_1.FootballProvider.getLiveMatches();
            const matches = result.matches || [];
            const predictions = football_prediction_engine_1.FootballPredictionEngine.predict(matches);
            return res.json({
                success: true,
                totalPredictions: predictions.length,
                predictions,
                bestPrediction: predictions[0] || null
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro predictions'
            });
        }
    }
    static async odds(req, res) {
        try {
            const result = await football_provider_1.FootballProvider.getLiveMatches();
            const matches = result.matches || [];
            const odds = football_odds_engine_1.FootballOddsEngine.calculate(matches);
            return res.json({
                success: true,
                totalOdds: odds.length,
                odds
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Erro odds'
            });
        }
    }
}
exports.FootballController = FootballController;
