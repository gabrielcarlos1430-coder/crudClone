"use strict";
// src/modules/football/football.prediction.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.footballPredictionEngine = exports.FootballPredictionEngine = void 0;
const football_team_memory_1 = require("./football.team.memory");
const live_pressure_engine_1 = require("../../modules/football-ai/engines/live-pressure.engine");
const weight_optimizer_1 = require("../football-ai/learning/weight.optimizer");
const confidence_calibrator_1 = require("../football-ai/learning/confidence.calibrator");
const match_dna_engine_1 = require("../football-ai/dna/match-dna.engine");
const collapse_detector_1 = require("../football-ai/dna/collapse-detector");
const comeback_engine_1 = require("../football-ai/dna/comeback-engine");
const chaos_index_engine_1 = require("../football-ai/dna/chaos-index.engine");
// ======================================
// ENGINE
// ======================================
class FootballPredictionEngine {
    // ======================================
    // HELPERS
    // ======================================
    static safe(value, fallback = 0) {
        if (value === undefined ||
            value === null ||
            Number.isNaN(value) ||
            !Number.isFinite(value)) {
            return fallback;
        }
        return value;
    }
    static normalizeScore(score) {
        return Math.min(100, Math.max(0, score));
    }
    static toFixed(value, decimals = 2) {
        return Number(value.toFixed(decimals));
    }
    // ======================================
    // SINGLE
    // ======================================
    static single(match) {
        const home = football_team_memory_1.footballTeamMemory.get(match.homeTeam);
        const away = football_team_memory_1.footballTeamMemory.get(match.awayTeam);
        // ======================================
        // LIVE PRESSURE
        // ======================================
        const pressure = live_pressure_engine_1.LivePressureEngine.analyze(match) ?? {
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            homePressure: 50,
            awayPressure: 50,
            dominantTeam: 'BALANCED',
            nextGoalTeam: 'BALANCED',
            goalProbability: 50,
            intensity: 'MEDIUM',
            dangerous: false,
            momentumShift: false,
            attackingSide: 'BALANCED',
            confidence: 50,
            reasons: []
        };
        // ======================================
        // WEIGHTS
        // ======================================
        const weights = weight_optimizer_1.weightOptimizer.getWeights();
        // ======================================
        // DNA
        // ======================================
        const { homeDNA, awayDNA } = match_dna_engine_1.MatchDNAEngine.build(match);
        const homeCollapse = collapse_detector_1.CollapseDetector.analyze(homeDNA);
        const awayCollapse = collapse_detector_1.CollapseDetector.analyze(awayDNA);
        const homeComeback = comeback_engine_1.ComebackEngine.analyze(homeDNA);
        const awayComeback = comeback_engine_1.ComebackEngine.analyze(awayDNA);
        const chaos = chaos_index_engine_1.ChaosIndexEngine.analyze(homeDNA, awayDNA);
        // ======================================
        // FALLBACK
        // ======================================
        if (!home ||
            !away) {
            let confidence = 55 + Math.random() * 20;
            confidence =
                confidence_calibrator_1.ConfidenceCalibrator
                    .calibrate(confidence);
            const homeAdvantage = pressure.homePressure >=
                pressure.awayPressure;
            const prediction = homeAdvantage
                ? 'HOME'
                : 'AWAY';
            const winner = homeAdvantage
                ? match.homeTeam
                : match.awayTeam;
            let market = pressure.goalProbability >= 78
                ? 'OVER_2_5'
                : 'OVER_1_5';
            const reasons = [
                'Fallback AI mode',
                ...(pressure.reasons || [])
            ];
            if (chaos.insaneMatch) {
                reasons.push('Partida extremamente caótica');
                market =
                    'OVER_2_5';
                confidence += 3;
            }
            confidence =
                Math.min(95, confidence);
            const fairOdd = 100 / confidence;
            const risk = 100 - confidence;
            const edge = confidence - risk;
            return {
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                winner,
                prediction,
                confidence: this.toFixed(confidence),
                fairOdd: this.toFixed(fairOdd),
                risk: this.toFixed(risk),
                edge: this.toFixed(edge),
                recommendation: confidence >= 78
                    ? 'STRONG BET'
                    : confidence >= 65
                        ? 'GOOD BET'
                        : 'RISKY BET',
                market,
                expectedGoalsHome: this.toFixed(pressure.homePressure / 45),
                expectedGoalsAway: this.toFixed(pressure.awayPressure / 45),
                matchIntensity: pressure.intensity,
                chaosIndex: this.toFixed(chaos.chaosIndex),
                reasons,
                pressure
            };
        }
        // ======================================
        // REAL AI SCORE
        // ======================================
        let homeScore = 0;
        let awayScore = 0;
        const reasons = [];
        // ======================================
        // OFFENSE
        // ======================================
        homeScore +=
            this.safe(home.offensiveStrength) * weights.offense;
        awayScore +=
            this.safe(away.offensiveStrength) * weights.offense;
        // ======================================
        // DEFENSE
        // ======================================
        homeScore +=
            this.safe(home.defensiveStrength) * weights.defense;
        awayScore +=
            this.safe(away.defensiveStrength) * weights.defense;
        // ======================================
        // FORM
        // ======================================
        homeScore +=
            this.safe(home.formScore) * weights.form;
        awayScore +=
            this.safe(away.formScore) * weights.form;
        // ======================================
        // MOMENTUM
        // ======================================
        homeScore +=
            this.safe(home.momentum) * weights.momentum;
        awayScore +=
            this.safe(away.momentum) * weights.momentum;
        // ======================================
        // PRESSURE
        // ======================================
        homeScore +=
            pressure.homePressure *
                weights.pressure;
        awayScore +=
            pressure.awayPressure *
                weights.pressure;
        // ======================================
        // HOME ADVANTAGE
        // ======================================
        homeScore += 4;
        // ======================================
        // DNA
        // ======================================
        homeScore +=
            homeDNA.offensiveDNA * 0.4;
        awayScore +=
            awayDNA.offensiveDNA * 0.4;
        homeScore +=
            homeDNA.emotionalStability * 0.25;
        awayScore +=
            awayDNA.emotionalStability * 0.25;
        homeScore +=
            homeDNA.dominance * 0.3;
        awayScore +=
            awayDNA.dominance * 0.3;
        // ======================================
        // COLLAPSE
        // ======================================
        if (awayCollapse.dangerous) {
            reasons.push(`${match.awayTeam} risco de colapso`);
            homeScore += 10;
        }
        if (homeCollapse.dangerous) {
            reasons.push(`${match.homeTeam} risco de colapso`);
            awayScore += 10;
        }
        // ======================================
        // COMEBACK
        // ======================================
        if (homeComeback.eliteComeback) {
            reasons.push(`${match.homeTeam} forte reação`);
            homeScore += 5;
        }
        if (awayComeback.eliteComeback) {
            reasons.push(`${match.awayTeam} forte reação`);
            awayScore += 5;
        }
        // ======================================
        // CHAOS
        // ======================================
        if (chaos.insaneMatch) {
            reasons.push('Jogo extremamente caótico');
        }
        // ======================================
        // NORMALIZE
        // ======================================
        homeScore =
            this.normalizeScore(homeScore);
        awayScore =
            this.normalizeScore(awayScore);
        // ======================================
        // DIFF
        // ======================================
        const diff = Math.abs(homeScore -
            awayScore);
        // ======================================
        // PREDICTION
        // ======================================
        let prediction;
        if (diff < 12) {
            prediction =
                'DRAW';
        }
        else if (homeScore >
            awayScore) {
            prediction =
                'HOME';
        }
        else {
            prediction =
                'AWAY';
        }
        // ======================================
        // WINNER
        // ======================================
        const winner = prediction === 'HOME'
            ? match.homeTeam
            : prediction === 'AWAY'
                ? match.awayTeam
                : 'DRAW';
        // ======================================
        // CONFIDENCE
        // ======================================
        let confidence = 55 +
            (diff * 0.7);
        if (prediction === 'DRAW') {
            confidence -= 8;
        }
        if (chaos.insaneMatch) {
            confidence -= 5;
        }
        confidence =
            confidence_calibrator_1.ConfidenceCalibrator
                .calibrate(Math.min(95, confidence));
        confidence =
            Math.max(35, confidence);
        // ======================================
        // FAIR ODD / RISK
        // ======================================
        const fairOdd = 100 / confidence;
        const risk = 100 - confidence;
        const edge = confidence - risk;
        // ======================================
        // EXPECTED GOALS
        // ======================================
        const expectedGoalsHome = this.toFixed(((this.safe(home.averageGoalsScored) * 0.65) +
            (this.safe(away.averageGoalsConceded) * 0.35) +
            (pressure.homePressure / 100)));
        const expectedGoalsAway = this.toFixed(((this.safe(away.averageGoalsScored) * 0.65) +
            (this.safe(home.averageGoalsConceded) * 0.35) +
            (pressure.awayPressure / 100)));
        // ======================================
        // MARKET
        // ======================================
        let market;
        const totalExpectedGoals = expectedGoalsHome +
            expectedGoalsAway;
        if (totalExpectedGoals >= 3) {
            market =
                'OVER_2_5';
        }
        else if (totalExpectedGoals >= 2) {
            market =
                'OVER_1_5';
        }
        else if (prediction === 'HOME') {
            market =
                'HOME_WIN';
        }
        else if (prediction === 'AWAY') {
            market =
                'AWAY_WIN';
        }
        else {
            market =
                'DRAW';
        }
        // ======================================
        // CHAOS MARKET
        // ======================================
        if (chaos.insaneMatch) {
            market =
                'OVER_2_5';
        }
        // ======================================
        // LOW CONFIDENCE FILTER
        // ======================================
        if (confidence < 52) {
            market =
                'LOW_CONFIDENCE';
        }
        // ======================================
        // RECOMMENDATION
        // ======================================
        let recommendation = 'RISKY BET';
        if (confidence >= 82 &&
            risk <= 18) {
            recommendation =
                'STRONG BET';
        }
        else if (confidence >= 68) {
            recommendation =
                'GOOD BET';
        }
        // ======================================
        // EXTRA REASONS
        // ======================================
        if (pressure.dangerous) {
            reasons.push('Alta pressão ofensiva');
        }
        if (pressure.momentumShift) {
            reasons.push('Mudança de momentum');
        }
        if (totalExpectedGoals >= 3) {
            reasons.push('Alta expectativa de gols');
        }
        // ======================================
        // RESULT
        // ======================================
        return {
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            winner,
            prediction,
            confidence: this.toFixed(confidence),
            fairOdd: this.toFixed(fairOdd),
            risk: this.toFixed(risk),
            edge: this.toFixed(edge),
            recommendation,
            market,
            expectedGoalsHome,
            expectedGoalsAway,
            matchIntensity: pressure.intensity,
            chaosIndex: this.toFixed(chaos.chaosIndex),
            reasons: [
                ...new Set([
                    ...reasons,
                    ...(pressure.reasons || [])
                ])
            ],
            pressure
        };
    }
    // ======================================
    // MULTI
    // ======================================
    static predict(matches) {
        if (!Array.isArray(matches)) {
            return [];
        }
        return matches
            .map(match => this.single(match))
            .sort((a, b) => b.confidence -
            a.confidence);
    }
}
exports.FootballPredictionEngine = FootballPredictionEngine;
// ======================================
// SINGLETON
// ======================================
exports.footballPredictionEngine = new FootballPredictionEngine();
