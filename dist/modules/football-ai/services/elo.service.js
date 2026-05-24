"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EloService = void 0;
const football_provider_1 = require("../../football/football.provider");
const elo_engine_1 = require("../engines/elo.engine");
class EloService {
    // ======================================
    // BUILD
    // ======================================
    static async build() {
        const data = await football_provider_1.FootballProvider.getLiveMatches();
        const matches = data.matches || [];
        this.eloMap = elo_engine_1.EloEngine.init(matches);
        return this.eloMap;
    }
    // ======================================
    // GET MAP
    // ======================================
    static async getMap() {
        if (!this.eloMap) {
            await this.build();
        }
        return this.eloMap;
    }
    // ======================================
    // PREDICT
    // ======================================
    static async predict(home, away) {
        const map = await this.getMap();
        return elo_engine_1.EloEngine.predict(map, home, away);
    }
}
exports.EloService = EloService;
EloService.eloMap = null;
