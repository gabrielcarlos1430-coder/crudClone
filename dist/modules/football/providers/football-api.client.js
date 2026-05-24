"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballAPIProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class FootballAPIProvider {
    // ==========================================
    // ⚽ LIVE MATCHES
    // ==========================================
    static async getLiveMatches() {
        try {
            if (!this.API_KEY) {
                console.log('⚠️ FOOTBALL_API_KEY não configurada');
                return [];
            }
            const response = await axios_1.default.get(`${this.BASE_URL}/matches?status=LIVE`, {
                headers: {
                    'X-Auth-Token': this.API_KEY
                },
                timeout: 10000
            });
            const matches = response.data?.matches || [];
            // ==========================================
            // 🔄 NORMALIZE
            // ==========================================
            return matches.map((match) => ({
                homeTeam: match?.homeTeam?.name ||
                    'Unknown Home',
                awayTeam: match?.awayTeam?.name ||
                    'Unknown Away',
                league: match?.competition?.name ||
                    'Unknown League',
                status: match?.status || 'LIVE',
                date: match?.utcDate ||
                    new Date().toISOString(),
                minute: match?.minute || 0,
                homeScore: match?.score?.fullTime?.home ??
                    0,
                awayScore: match?.score?.fullTime?.away ??
                    0
            }));
        }
        catch (error) {
            console.log('⚠️ API real falhou:', error?.message);
            return [];
        }
    }
}
exports.FootballAPIProvider = FootballAPIProvider;
FootballAPIProvider.API_KEY = process.env.FOOTBALL_API_KEY;
FootballAPIProvider.BASE_URL = 'https://api.football-data.org/v4';
