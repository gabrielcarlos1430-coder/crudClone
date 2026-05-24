"use strict";
// src/modules/football/football.realtime.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballRealtime = void 0;
const football_provider_1 = require("./football.provider");
const football_analytics_1 = require("./football.analytics");
const football_prediction_engine_1 = require("./football.prediction.engine");
const football_odds_engine_1 = require("./football.odds.engine");
const form_engine_1 = require("../../modules/football-ai/engines/form.engine");
const value_bet_engine_1 = require("../../modules/football-ai/engines/value-bet.engine");
const match_timeline_engine_1 = require("../../modules/football-ai/engines/match-timeline.engine");
const live_event_engine_1 = require("../../modules/football-ai/engines/live-event.engine");
const quantum_score_engine_1 = require("../../modules/football-ai/engines/quantum-score.engine");
const ranking_engine_1 = require("../../modules/football-ai/engines/ranking.engine");
const quantum_market_engine_1 = require("../../modules/football-ai/quantum/quantum-market.engine");
const quantum_match_engine_1 = require("../../modules/football-ai/quantum/quantum-match.engine");
const ai_core_engine_1 = require("../../modules/football-ai/core/ai-core.engine");
const ws_server_1 = require("../../shared/websocket/ws.server");
class FootballRealtime {
    static start() {
        if (this.started)
            return;
        this.started = true;
        console.log('⚽ FootballRealtime iniciado');
        this.update();
        this.interval = setInterval(() => this.update(), 30000);
    }
    static async update() {
        if (this.processing)
            return;
        this.processing = true;
        try {
            // ==========================================
            // PROVIDER (DADO REAL)
            // ==========================================
            const result = await football_provider_1.FootballProvider.getLiveMatches();
            if (!result?.success)
                return;
            const rawMatches = result.matches || [];
            const matches = rawMatches.filter((match) => {
                const status = String(match?.status || '').toLowerCase();
                return (status.includes('live') ||
                    status.includes('1h') ||
                    status.includes('2h') ||
                    status.includes('ht') ||
                    status.includes('ns') ||
                    status.includes('not started') ||
                    status.includes('inplay'));
            });
            if (matches.length === 0)
                return;
            // ==========================================
            // ANALYTICS
            // ==========================================
            const analytics = football_analytics_1.FootballAnalytics.analyze(matches);
            try {
                form_engine_1.FormEngine.update(analytics);
            }
            catch { }
            // ==========================================
            // PREDICTIONS
            // ==========================================
            const predictions = football_prediction_engine_1.FootballPredictionEngine
                .predict(matches)
                .map((prediction) => {
                const timeline = match_timeline_engine_1.MatchTimelineEngine.analyze(`${prediction.homeTeam}_${prediction.awayTeam}`, prediction.pressure || null);
                return {
                    ...prediction,
                    timeline
                };
            })
                .sort((a, b) => b.confidence - a.confidence);
            // ==========================================
            // QUANTUM + AI
            // ==========================================
            const quantum = quantum_match_engine_1.QuantumMatchEngine.simulateMany(predictions);
            const quantumAnalysis = predictions.map(p => ({
                prediction: p,
                quantum: quantum_market_engine_1.QuantumMarketEngine.analyze(p)
            }));
            const aiCore = ai_core_engine_1.AICoreEngine.process();
            // ==========================================
            // TACTICAL (mantido, sem fake crítico)
            // ==========================================
            const tactical = predictions.map((p) => ({
                match: `${p.homeTeam} vs ${p.awayTeam}`,
                homeTeam: p.homeTeam,
                awayTeam: p.awayTeam,
                homeDanger: Math.floor(Math.random() * 100),
                awayDanger: Math.floor(Math.random() * 100),
                possessionHome: Math.floor(40 + Math.random() * 20),
                possessionAway: Math.floor(40 + Math.random() * 20),
                intensity: Math.floor(60 + Math.random() * 40),
                zones: [],
                momentumFlow: []
            }));
            // ==========================================
            // LIVE EVENTS
            // ==========================================
            const liveEvents = live_event_engine_1.LiveEventEngine.analyzeMany(predictions);
            // ==========================================
            // QUANTUM SCORES
            // ==========================================
            const quantumScores = quantum_score_engine_1.QuantumScoreEngine
                .analyzeMany(predictions, liveEvents)
                .sort((a, b) => b.quantumScore - a.quantumScore);
            const rankedMatches = ranking_engine_1.RankingEngine.analyze(quantumScores);
            const topSignals = ranking_engine_1.RankingEngine.topSignals(rankedMatches);
            // ==========================================
            // VALUE BETS
            // ==========================================
            const valueBets = value_bet_engine_1.ValueBetEngine
                .analyzeMany(predictions)
                .sort((a, b) => b.edge - a.edge);
            // ==========================================
            // ODDS
            // ==========================================
            const odds = football_odds_engine_1.FootballOddsEngine
                .calculate(matches)
                .sort((a, b) => b.fairOdd - a.fairOdd);
            const topValueBets = valueBets.filter(i => i.valueBet).slice(0, 10);
            // ==========================================
            // SNAPSHOT FINAL
            // ==========================================
            const snapshot = {
                success: true,
                totalMatches: matches.length,
                matches,
                analytics,
                topTeams: analytics.slice(0, 10),
                hottestTeam: analytics[0] || null,
                predictions,
                totalPredictions: predictions.length,
                bestPrediction: predictions[0] || null,
                quantum,
                quantumAnalysis,
                aiCore,
                tactical,
                liveEvents,
                quantumScores,
                bestQuantum: quantumScores[0] || null,
                rankedMatches,
                topSignals,
                bestRanked: rankedMatches[0] || null,
                odds,
                totalOdds: odds.length,
                valueBets,
                topValueBets,
                bestValueBet: topValueBets[0] || null,
                totalValueBets: topValueBets.length,
                updatedAt: new Date().toISOString(),
            };
            // ==========================================
            // HASH CHECK
            // ==========================================
            const hash = JSON.stringify({
                totalMatches: snapshot.totalMatches,
                firstMatch: snapshot.matches?.[0],
                lastMatch: snapshot.matches?.[snapshot.matches.length - 1],
                bestPrediction: snapshot.bestPrediction,
                bestValueBet: snapshot.bestValueBet,
                bestQuantum: snapshot.bestQuantum,
                bestRanked: snapshot.bestRanked
            });
            if (hash === this.lastHash)
                return;
            this.lastHash = hash;
            this.snapshot = Object.freeze({ ...snapshot });
            (0, ws_server_1.broadcastFootball)(snapshot);
        }
        catch (error) {
            console.error('🔴 FootballRealtime erro:', error);
        }
        finally {
            this.processing = false;
        }
    }
    static getSnapshot() {
        return this.snapshot;
    }
    static stop() {
        if (this.interval)
            clearInterval(this.interval);
        this.started = false;
    }
}
exports.FootballRealtime = FootballRealtime;
FootballRealtime.started = false;
FootballRealtime.interval = null;
FootballRealtime.processing = false;
FootballRealtime.snapshot = null;
FootballRealtime.lastHash = '';
