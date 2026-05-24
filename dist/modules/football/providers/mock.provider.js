"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProvider = void 0;
class MockProvider {
    static getLiveMatches() {
        return [
            {
                homeTeam: "Barcelona",
                awayTeam: "Real Madrid",
                league: "La Liga",
                date: new Date().toISOString(),
                status: "LIVE",
                minute: 65,
                homeScore: 2,
                awayScore: 1
            },
            {
                homeTeam: "Liverpool",
                awayTeam: "Arsenal",
                league: "Premier League",
                date: new Date().toISOString(),
                status: "HT",
                minute: 45,
                homeScore: 1,
                awayScore: 1
            }
        ];
    }
}
exports.MockProvider = MockProvider;
