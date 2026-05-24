"use strict";
// src/modules/football/football-api.provider.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballAPIProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../../config/env");
// ==========================================
// ⚽ API PROVIDER (REAL DATA)
// ==========================================
class FootballAPIProvider {
    // ==========================================
    // 🚀 HEADERS
    // ==========================================
    static getHeaders() {
        return {
            "x-apisports-key": env_1.env.footballApiKey,
            "x-rapidapi-host": env_1.env.footballApiHost,
        };
    }
    // ==========================================
    // ⚽ LIVE MATCHES
    // ==========================================
    static async getLiveMatches() {
        try {
            const response = await axios_1.default.get(`${this.BASE_URL}/fixtures?live=all`, {
                headers: this.getHeaders(),
                timeout: 10000,
            });
            const data = response.data?.response || [];
            return data.map((item) => ({
                homeTeam: item.teams?.home?.name,
                awayTeam: item.teams?.away?.name,
                league: item.league?.name,
                status: item.fixture?.status?.short,
                minute: item.fixture?.status?.elapsed,
                homeScore: item.goals?.home,
                awayScore: item.goals?.away,
            }));
        }
        catch (error) {
            console.error("🔴 Football API error:", error);
            return [];
        }
    }
    // ==========================================
    // 📊 FIXTURES TODAY
    // ==========================================
    static async getTodayMatches() {
        try {
            const response = await axios_1.default.get(`${this.BASE_URL}/fixtures?date=${new Date()
                .toISOString()
                .split("T")[0]}`, {
                headers: this.getHeaders(),
            });
            return response.data?.response || [];
        }
        catch (error) {
            console.error("🔴 Football API today error:", error);
            return [];
        }
    }
}
exports.FootballAPIProvider = FootballAPIProvider;
FootballAPIProvider.BASE_URL = "https://v3.football.api-sports.io";
