"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballProvider = void 0;
const football_api_client_1 = require("../providers/football-api.client");
const scorebat_provider_1 = require("../providers/scorebat.provider");
const mock_provider_1 = require("../providers/mock.provider");
class FootballProvider {
    static async getLiveMatches() {
        // =========================
        // CACHE
        // =========================
        if (this.cache &&
            Date.now() - this.cache.timestamp < this.CACHE_TTL) {
            return this.cache.data;
        }
        let matches = [];
        let source = "mock";
        // =========================
        // 1. API REAL
        // =========================
        const api = await football_api_client_1.FootballAPIProvider.getLiveMatches();
        if (api.length > 0) {
            matches = api;
            source = "api";
        }
        // =========================
        // 2. SCOREBAT
        // =========================
        if (matches.length === 0) {
            const sb = await scorebat_provider_1.ScorebatProvider.getLiveMatches();
            if (sb.length > 0) {
                matches = sb;
                source = "scorebat";
            }
        }
        // =========================
        // 3. MOCK
        // =========================
        if (matches.length === 0) {
            matches = mock_provider_1.MockProvider.getLiveMatches();
            source = "mock";
        }
        const result = {
            success: true,
            source,
            total: matches.length,
            matches,
        };
        this.cache = {
            timestamp: Date.now(),
            data: result,
        };
        return result;
    }
    static clearCache() {
        this.cache = null;
    }
}
exports.FootballProvider = FootballProvider;
FootballProvider.cache = null;
FootballProvider.CACHE_TTL = 30000;
