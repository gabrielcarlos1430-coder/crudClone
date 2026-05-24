"use strict";
// src/modules/history/history.memory.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryMemory = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const history_generator_1 = require("./history.generator");
// ==========================================
// 🧠 HISTORY MEMORY
// ==========================================
class HistoryMemory {
    // ==========================================
    // 🚀 INIT
    // ==========================================
    static async init() {
        // ==========================================
        // 🚫 JÁ CARREGADO
        // ==========================================
        if (this.history.length > 0) {
            return;
        }
        try {
            console.log('🧠 Carregando histórico do PostgreSQL...');
            // ==========================================
            // 🗄️ LOAD DATABASE
            // ==========================================
            const draws = await prisma_1.default.drawHistory.findMany({
                orderBy: {
                    createdAt: 'asc'
                },
                take: 10000
            });
            // ==========================================
            // 🧠 DATABASE → RAM
            // ==========================================
            this.history = draws.map(draw => ({
                number: draw.number,
                extractedAt: draw.createdAt,
                source: draw.source || 'db'
            }));
            // ==========================================
            // 🚨 FALLBACK
            // ==========================================
            if (this.history.length === 0) {
                console.log('⚠️ Banco vazio, gerando fake history...');
                this.history =
                    history_generator_1.HistoryGenerator.generate(10000);
            }
            console.log('✅ Histórico carregado:', this.history.length);
        }
        catch (error) {
            console.error('🔴 Erro ao carregar histórico:', error);
            // ==========================================
            // 🚨 FAILSAFE
            // ==========================================
            this.history =
                history_generator_1.HistoryGenerator.generate(10000);
        }
    }
    // ==========================================
    // 📋 GET ALL
    // ==========================================
    static async getAll() {
        await this.init();
        return this.history;
    }
    // ==========================================
    // ➕ ADD DRAW
    // ==========================================
    static async addDraw(draw) {
        // ==========================================
        // 🧠 RAM
        // ==========================================
        this.history.push(draw);
        // ==========================================
        // 🗄️ POSTGRESQL
        // ==========================================
        try {
            await prisma_1.default.drawHistory.create({
                data: {
                    number: draw.number,
                    source: draw.source,
                    metadata: {
                        extractedAt: draw.extractedAt
                    }
                }
            });
        }
        catch (error) {
            console.error('🔴 Erro ao salvar draw:', error);
        }
    }
    // ==========================================
    // 🔢 GET NUMBERS ONLY
    // ==========================================
    static async getNumbers() {
        await this.init();
        return this.history.map(h => h.number);
    }
}
exports.HistoryMemory = HistoryMemory;
HistoryMemory.history = [];
