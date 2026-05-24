"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballOddsProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class FootballOddsProvider {
    static async getOdds() {
        try {
            const res = await axios_1.default.get('https://api.the-odds-api.com/v4/sports/soccer/odds', {
                params: {
                    apiKey: process.env.ODDS_API_KEY,
                    regions: 'eu',
                    markets: 'h2h',
                    oddsFormat: 'decimal'
                }
            });
            const data = res.data || [];
            return data.map((match) => {
                const book = match.bookmakers?.[0];
                const h2h = book?.markets?.[0]?.outcomes || [];
                return {
                    homeTeam: match.home_team,
                    awayTeam: match.away_team,
                    bookmaker: book?.title || 'unknown',
                    homeWin: h2h[0]?.price || 0,
                    awayWin: h2h[1]?.price || 0,
                    draw: h2h[2]?.price || 0
                };
            });
        }
        catch (err) {
            console.error('ODDS ERROR:', err);
            return [];
        }
    }
}
exports.FootballOddsProvider = FootballOddsProvider;
