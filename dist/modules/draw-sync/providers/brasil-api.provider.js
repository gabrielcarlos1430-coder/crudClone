"use strict";
// src/modules/draw-sync/providers/brasil-api.provider.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrasilApiProvider = void 0;
const axios_1 = __importDefault(require("axios"));
// ==========================================
// 🇧🇷 LOTERIA API PROVIDER
// ==========================================
class BrasilApiProvider {
    // ==========================================
    // 🎰 FETCH MEGA-SENA
    // ==========================================
    static async fetchMegaSena() {
        try {
            const response = await axios_1.default.get('https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena');
            const data = response.data;
            // ==========================================
            // 🔢 DEZENAS
            // ==========================================
            const dezenas = data.listaDezenas || [];
            // ==========================================
            // 🎲 CONVERT TO DRAWS
            // ==========================================
            const draws = dezenas.map((dezena) => ({
                number: dezena.padStart(4, '0'),
                source: 'mega-sena',
                extractedAt: new Date(),
                metadata: {
                    concurso: data.numero,
                    dataApuracao: data.dataApuracao
                }
            }));
            console.log(`🎰 Mega-Sena carregada: ${draws.length} dezenas`);
            return {
                success: true,
                total: draws.length,
                draws
            };
        }
        catch (error) {
            console.error('🔴 BrasilApiProvider erro:', error);
            return {
                success: false,
                total: 0,
                draws: []
            };
        }
    }
}
exports.BrasilApiProvider = BrasilApiProvider;
