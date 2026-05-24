"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FootballProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
// ==========================================
// ⚽ FOOTBALL PROVIDER
// ==========================================
class FootballProvider {
    // ==========================================
    // ⚽ GET LIVE MATCHES
    // ==========================================
    static async getLiveMatches() {
        try {
            // ==========================================
            // ⚡ CACHE
            // ==========================================
            if (this.cache &&
                Date.now() -
                    this.cache.timestamp <
                    this.CACHE_TTL) {
                console.log('⚡ Football cache hit');
                return {
                    ...this.cache.data,
                    cached: true
                };
            }
            console.log('⚽ Buscando partidas reais...');
            // ==========================================
            // 🔑 API KEY
            // ==========================================
            if (!env_1.env.footballApiKey) {
                console.error('🔴 API_FOOTBALL_KEY não encontrada');
                return {
                    success: false,
                    total: 0,
                    matches: [],
                    error: 'API KEY NOT FOUND'
                };
            }
            // ==========================================
            // 📡 HEADERS
            // ==========================================
            const headers = {
                'x-apisports-key': env_1.env.footballApiKey,
                'x-rapidapi-host': env_1.env.footballApiHost,
                Accept: 'application/json'
            };
            // ==========================================
            // 📦 RAW DATA
            // ==========================================
            let raw = [];
            // ==========================================
            // 🔴 LIVE MATCHES
            // ==========================================
            try {
                console.log('🔴 Buscando jogos ao vivo...');
                const liveResponse = await axios_1.default.get('https://v3.football.api-sports.io/fixtures?live=all', {
                    timeout: 15000,
                    headers
                });
                raw =
                    liveResponse.data?.response || [];
                console.log(`🟢 LIVE: ${raw.length} jogos`);
            }
            catch (error) {
                console.log('🟡 Nenhum jogo ao vivo disponível');
            }
            // ==========================================
            // 📅 FALLBACK TODAY MATCHES
            // ==========================================
            if (raw.length === 0) {
                try {
                    const today = new Date()
                        .toISOString()
                        .split('T')[0];
                    console.log(`📅 Buscando jogos do dia: ${today}`);
                    const todayResponse = await axios_1.default.get(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
                        timeout: 15000,
                        headers
                    });
                    raw =
                        todayResponse.data?.response || [];
                    console.log(`🟢 TODAY: ${raw.length} jogos`);
                }
                catch (error) {
                    console.log('🟡 Falha ao buscar jogos do dia');
                }
            }
            // ==========================================
            // ⏭️ FALLBACK NEXT MATCHES
            // ==========================================
            if (raw.length === 0) {
                try {
                    console.log('⏭️ Buscando próximos jogos...');
                    const nextResponse = await axios_1.default.get('https://v3.football.api-sports.io/fixtures?next=20', {
                        timeout: 15000,
                        headers
                    });
                    raw =
                        nextResponse.data?.response || [];
                    console.log(`🟢 NEXT: ${raw.length} jogos`);
                }
                catch (error) {
                    console.log('🔴 Falha ao buscar próximos jogos');
                }
            }
            // ==========================================
            // 🚫 NO MATCHES
            // ==========================================
            if (raw.length === 0) {
                console.log('🚫 Nenhuma partida encontrada');
                return {
                    success: true,
                    total: 0,
                    matches: [],
                    source: 'api-football',
                    updatedAt: Date.now()
                };
            }
            // ==========================================
            // ⚽ NORMALIZE
            // ==========================================
            const matches = raw.map((item) => ({
                id: String(item.fixture?.id || ''),
                homeTeam: item.teams?.home?.name ||
                    'Unknown',
                awayTeam: item.teams?.away?.name ||
                    'Unknown',
                league: item.league?.name ||
                    'Unknown',
                country: item.league?.country,
                season: String(item.league?.season || ''),
                date: item.fixture?.date ||
                    new Date().toISOString(),
                timestamp: item.fixture?.timestamp,
                status: item.fixture?.status?.short ||
                    'UNKNOWN',
                minute: Number(item.fixture?.status?.elapsed || 0),
                homeScore: Number(item.goals?.home || 0),
                awayScore: Number(item.goals?.away || 0),
                venue: item.fixture?.venue?.name,
                referee: item.fixture?.referee,
                source: 'api-football',
                lastUpdated: Date.now()
            }));
            // ==========================================
            // 📊 SORT
            // ==========================================
            matches.sort((a, b) => (b.minute || 0) -
                (a.minute || 0));
            // ==========================================
            // ✅ RESULT
            // ==========================================
            const result = {
                success: true,
                total: matches.length,
                matches,
                source: 'api-football',
                updatedAt: Date.now()
            };
            // ==========================================
            // ⚡ CACHE SAVE
            // ==========================================
            this.cache = {
                timestamp: Date.now(),
                data: result
            };
            console.log(`🟢 ${matches.length} partidas carregadas`);
            return result;
        }
        catch (error) {
            console.error('🔴 FootballProvider erro:', error?.response?.data ||
                error?.message ||
                error);
            return {
                success: false,
                total: 0,
                matches: [],
                error: 'FOOTBALL_PROVIDER_ERROR'
            };
        }
    }
    // ==========================================
    // 🧹 CLEAR CACHE
    // ==========================================
    static clearCache() {
        this.cache = null;
        console.log('🧹 Football cache limpo');
    }
}
exports.FootballProvider = FootballProvider;
FootballProvider.cache = null;
// ==========================================
// ⚡ CACHE TTL
// ==========================================
FootballProvider.CACHE_TTL = 1000 * 5;
