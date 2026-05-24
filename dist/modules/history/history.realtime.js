"use strict";
// src/modules/history/history.realtime.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryRealtimeEngine = void 0;
const history_memory_1 = require("./history.memory");
const generator_service_1 = require("../generator/generator.service");
// ==========================================
// ⚡ REALTIME ENGINE
// ==========================================
class HistoryRealtimeEngine {
    // ==========================================
    // 🚀 START ENGINE
    // ==========================================
    static start() {
        console.log('⚡ Realtime Engine iniciado');
        setInterval(async () => {
            try {
                // ==========================================
                // 🧠 GENERATE AI DRAW
                // ==========================================
                const generated = await generator_service_1.GeneratorService.generate({
                    quantity: 1,
                    mode: 'balanced'
                });
                const result = generated.numbers[0];
                if (!result) {
                    return;
                }
                // ==========================================
                // 💾 SAVE MEMORY
                // ==========================================
                await history_memory_1.HistoryMemory.addDraw({
                    number: result.number,
                    extractedAt: new Date(),
                    source: `AI-${result.source.toUpperCase()}`
                });
                // ==========================================
                // 📊 LOG
                // ==========================================
                console.log('🎲 Novo sorteio IA:', result.number, '| conf:', result.confidence, '| strategy:', result.source);
            }
            catch (error) {
                console.error('🔴 Erro realtime:', error);
            }
        }, 5000);
    }
}
exports.HistoryRealtimeEngine = HistoryRealtimeEngine;
