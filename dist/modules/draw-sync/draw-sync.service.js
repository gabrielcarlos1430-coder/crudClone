"use strict";
// src/modules/draw-sync/draw-sync.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawSyncService = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const brasil_api_provider_1 = require("./providers/brasil-api.provider");
const history_memory_1 = require("../history/history.memory");
// ==========================================
// 🚀 DRAW SYNC SERVICE
// ==========================================
class DrawSyncService {
    // ==========================================
    // 🔍 DRAW EXISTS
    // ==========================================
    static async drawExists(number) {
        const exists = await prisma_1.default.drawHistory.findFirst({
            where: {
                number
            }
        });
        return !!exists;
    }
    // ==========================================
    // 💾 SAVE DRAW
    // ==========================================
    static async saveDraw(draw) {
        try {
            // ==========================================
            // 🚫 DUPLICATE CHECK
            // ==========================================
            const alreadyExists = await this.drawExists(draw.number);
            if (alreadyExists) {
                console.log('🟡 Draw duplicado:', draw.number);
                return false;
            }
            // ==========================================
            // 💾 SAVE DATABASE
            // ==========================================
            await prisma_1.default.drawHistory.create({
                data: {
                    number: draw.number,
                    source: draw.source,
                    metadata: draw.metadata || {}
                }
            });
            // ==========================================
            // 🧠 UPDATE MEMORY
            // ==========================================
            await history_memory_1.HistoryMemory.addDraw({
                number: draw.number,
                extractedAt: draw.extractedAt,
                source: draw.source
            });
            console.log('✅ Draw salvo:', draw.number);
            return true;
        }
        catch (error) {
            console.error('🔴 Erro saveDraw:', error);
            return false;
        }
    }
    // ==========================================
    // 🇧🇷 SYNC MEGA-SENA
    // ==========================================
    static async syncMegaSena() {
        console.log('📡 Sincronizando Mega-Sena...');
        const result = await brasil_api_provider_1.BrasilApiProvider
            .fetchMegaSena();
        if (!result.success) {
            console.log('🔴 Falha sync Mega-Sena');
            return {
                success: false,
                saved: 0
            };
        }
        let saved = 0;
        // ==========================================
        // 💾 SAVE DRAWS
        // ==========================================
        for (const draw of result.draws) {
            const ok = await this.saveDraw(draw);
            if (ok) {
                saved++;
            }
        }
        // ==========================================
        // ✅ FINAL
        // ==========================================
        console.log(`🚀 Mega-Sena sincronizada: ${saved} novos draws`);
        return {
            success: true,
            total: result.total,
            saved
        };
    }
}
exports.DrawSyncService = DrawSyncService;
