"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalDrawBootstrap = void 0;
const brasil_api_provider_1 = require("../providers/brasil-api.provider");
const federal_provider_1 = require("./federal.provider");
const bicho_scraper_1 = require("./bicho.scraper");
class ExternalDrawBootstrap {
    static init() {
        console.log('🚀 External Draw Bootstrap ativado');
        // 🔁 override sem mexer no sistema original
        brasil_api_provider_1.BrasilApiProvider.fetchMegaSena = async () => {
            console.log('🔄 Fonte substituída por FEDERAL');
            const federal = await federal_provider_1.FederalProvider.fetchFederal();
            // fallback automático
            if (federal.success && federal.draws.length > 0) {
                return federal;
            }
            console.log('⚠️ Federal falhou, usando Bicho');
            return await bicho_scraper_1.BichoScraper.fetchBicho();
        };
    }
}
exports.ExternalDrawBootstrap = ExternalDrawBootstrap;
