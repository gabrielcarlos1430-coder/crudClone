"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederalProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class FederalProvider {
    static async fetchFederal() {
        try {
            console.log('📡 Scraper Federal REAL iniciando...');
            // ⚠️ página pública (estrutura pode variar, mas geralmente contém resultados)
            const url = 'https://loterias.caixa.gov.br/Paginas/Federal.aspx';
            const { data: html } = await axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 10000
            });
            const $ = cheerio.load(html);
            const draws = [];
            // 🔍 tentativa 1: tabela de resultados
            $('.resultado-loteria tbody tr').each((_, el) => {
                const cols = $(el).find('td');
                const premio = $(cols[0]).text().trim();
                const numero = $(cols[1]).text().trim();
                if (numero) {
                    draws.push({
                        number: String(numero).padStart(4, '0'),
                        source: 'federal',
                        extractedAt: new Date(),
                        metadata: {
                            premio,
                            raw: numero
                        }
                    });
                }
            });
            // 🔍 fallback: outra estrutura possível da Caixa
            if (draws.length === 0) {
                $('.lista-de-premios li').each((_, el) => {
                    const text = $(el).text().trim();
                    const match = text.match(/(\d{4,5})/);
                    if (match) {
                        draws.push({
                            number: match[1].padStart(4, '0'),
                            source: 'federal',
                            extractedAt: new Date(),
                            metadata: {
                                raw: text
                            }
                        });
                    }
                });
            }
            // 🔍 fallback final
            if (draws.length === 0) {
                console.log('⚠️ Scraper não encontrou estrutura conhecida');
            }
            console.log(`🟢 Federal scraper real: ${draws.length} itens`);
            return {
                success: draws.length > 0,
                total: draws.length,
                draws
            };
        }
        catch (error) {
            console.error('🔴 Erro Federal Scraper:', error.message);
            return {
                success: false,
                total: 0,
                draws: []
            };
        }
    }
}
exports.FederalProvider = FederalProvider;
