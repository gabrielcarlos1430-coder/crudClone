"use strict";
// src/modules/football/football.live-pressure.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.footballLivePressureEngine = exports.FootballLivePressureEngine = void 0;
// ======================================
// ENGINE
// ======================================
class FootballLivePressureEngine {
    // ======================================
    // ANALYZE
    // ======================================
    analyze(stats) {
        // ======================================
        // HOME SCORE
        // ======================================
        const homePressure = (stats.possessionHome * 0.2) +
            (stats.shotsHome * 8) +
            (stats.dangerousAttacksHome * 1.5) +
            (stats.cornersHome * 3);
        // ======================================
        // AWAY SCORE
        // ======================================
        const awayPressure = (stats.possessionAway * 0.2) +
            (stats.shotsAway * 8) +
            (stats.dangerousAttacksAway * 1.5) +
            (stats.cornersAway * 3);
        // ======================================
        // DOMINANT
        // ======================================
        const dominantTeam = homePressure >
            awayPressure
            ? stats.homeTeam
            : stats.awayTeam;
        // ======================================
        // DIFFERENCE
        // ======================================
        const pressureDifference = Math.abs(homePressure -
            awayPressure);
        // ======================================
        // INTENSITY
        // ======================================
        const intensity = Number(((homePressure +
            awayPressure) / 2).toFixed(2));
        // ======================================
        // RECOMMENDATION
        // ======================================
        let recommendation;
        if (pressureDifference < 10) {
            recommendation =
                'BALANCED';
        }
        else if (homePressure >
            awayPressure) {
            recommendation =
                'HOME_PRESSURE';
        }
        else {
            recommendation =
                'AWAY_PRESSURE';
        }
        // ======================================
        // RETURN
        // ======================================
        return {
            dominantTeam,
            homePressure: Number(homePressure.toFixed(2)),
            awayPressure: Number(awayPressure.toFixed(2)),
            pressureDifference: Number(pressureDifference.toFixed(2)),
            intensity,
            recommendation,
        };
    }
}
exports.FootballLivePressureEngine = FootballLivePressureEngine;
// ======================================
// SINGLETON
// ======================================
exports.footballLivePressureEngine = new FootballLivePressureEngine();
