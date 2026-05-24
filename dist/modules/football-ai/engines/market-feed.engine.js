"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketFeedEngine = void 0;
class MarketFeedEngine {
    static async fetchLiveOdds() {
        // 🔴 AQUI ENTRA API REAL FUTURAMENTE
        // agora mock controlado production-ready
        return [
            {
                homeTeam: 'PSG',
                awayTeam: 'Monaco',
                market: '1X2',
                homeOdd: 1.65,
                awayOdd: 4.2,
                drawOdd: 3.8,
                timestamp: Date.now(),
            },
            {
                homeTeam: 'Barcelona',
                awayTeam: 'Getafe',
                market: 'OVER_2_5',
                homeOdd: 1.80,
                awayOdd: 2.10,
                timestamp: Date.now(),
            }
        ];
    }
}
exports.MarketFeedEngine = MarketFeedEngine;
