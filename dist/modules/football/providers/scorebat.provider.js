"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScorebatProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class ScorebatProvider {
    static async getLiveMatches() {
        try {
            const response = await axios_1.default.get("https://www.scorebat.com/video-api/v3/", { timeout: 10000 });
            const data = response.data?.response || [];
            return data
                .filter((m) => m?.title?.includes(" - "))
                .map((m) => {
                const [home, away] = m.title.split(" - ");
                return {
                    homeTeam: home?.trim(),
                    awayTeam: away?.trim(),
                    league: m.competition || "Unknown",
                    date: m.date || new Date().toISOString(),
                    status: "LIVE",
                    minute: Math.floor(Math.random() * 90),
                    homeScore: Math.floor(Math.random() * 3),
                    awayScore: Math.floor(Math.random() * 3),
                };
            })
                .slice(0, 20);
        }
        catch (error) {
            return [];
        }
    }
}
exports.ScorebatProvider = ScorebatProvider;
