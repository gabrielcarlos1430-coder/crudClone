"use strict";
// src/modules/football-ai/learning/learning.memory.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningMemory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ======================================
// ENGINE
// ======================================
class LearningMemory {
    // ======================================
    // CONSTRUCTOR
    // ======================================
    constructor() {
        // ======================================
        // FILE
        // ======================================
        this.file = path_1.default.resolve(process.cwd(), 'data/football-learning.json');
        // ======================================
        // MEMORY
        // ======================================
        this.memory = [];
        this.ensureFolder();
        this.load();
    }
    // ======================================
    // ENSURE FOLDER
    // ======================================
    ensureFolder() {
        const dir = path_1.default.dirname(this.file);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, {
                recursive: true
            });
        }
    }
    // ======================================
    // LOAD
    // ======================================
    load() {
        try {
            if (!fs_1.default.existsSync(this.file)) {
                this.memory = [];
                return;
            }
            const raw = fs_1.default.readFileSync(this.file, 'utf-8');
            const parsed = JSON.parse(raw);
            this.memory =
                Array.isArray(parsed)
                    ? parsed
                    : [];
            console.log(`🧠 LearningMemory carregado: ${this.memory.length} registros`);
        }
        catch (error) {
            console.error('❌ Erro carregando LearningMemory', error);
            this.memory = [];
        }
    }
    // ======================================
    // SAVE
    // ======================================
    persist() {
        try {
            fs_1.default.writeFileSync(this.file, JSON.stringify(this.memory, null, 2));
        }
        catch (error) {
            console.error('❌ Erro salvando LearningMemory', error);
        }
    }
    // ======================================
    // ADD
    // ======================================
    add(entry) {
        // ====================================
        // DUPLICATE PROTECTION
        // ====================================
        const exists = this.memory.some(item => item.id === entry.id);
        if (exists) {
            return;
        }
        this.memory.push({
            ...entry,
            confidence: Number(entry.confidence.toFixed(2)),
            edge: Number((entry.edge || 0).toFixed(2))
        });
        // ====================================
        // LIMIT MEMORY
        // ====================================
        if (this.memory.length > 10000) {
            this.memory =
                this.memory.slice(-10000);
        }
        this.persist();
        console.log(`🧠 Learning salvo: ${entry.match}`);
    }
    // ======================================
    // GET ALL
    // ======================================
    getAll() {
        return [...this.memory];
    }
    // ======================================
    // LAST
    // ======================================
    latest(limit = 20) {
        return this.memory.slice(-limit);
    }
    // ======================================
    // CLEAR
    // ======================================
    clear() {
        this.memory = [];
        this.persist();
        console.log('🧹 LearningMemory limpo');
    }
    // ======================================
    // STATS
    // ======================================
    stats() {
        const total = this.memory.length;
        // ====================================
        // EMPTY
        // ====================================
        if (!total) {
            return {
                total: 0,
                wins: 0,
                losses: 0,
                accuracy: 0,
                roi: 0,
                averageConfidence: 0,
                eliteAccuracy: 0,
                lowConfidenceAccuracy: 0
            };
        }
        // ====================================
        // BASIC
        // ====================================
        const wins = this.memory.filter(x => x.result === 'WIN').length;
        const losses = total - wins;
        const accuracy = Number(((wins / total) * 100).toFixed(2));
        // ====================================
        // ROI
        // ====================================
        let profit = 0;
        for (const item of this.memory) {
            if (item.result === 'WIN') {
                profit +=
                    (item.realOdd || 2) - 1;
            }
            else {
                profit -= 1;
            }
        }
        const roi = Number(((profit / total) * 100).toFixed(2));
        // ====================================
        // CONFIDENCE
        // ====================================
        const averageConfidence = Number((this.memory.reduce((acc, item) => acc + item.confidence, 0) / total).toFixed(2));
        // ====================================
        // ELITE
        // ====================================
        const elite = this.memory.filter(item => item.confidence >= 80);
        const eliteWins = elite.filter(item => item.result === 'WIN').length;
        const eliteAccuracy = elite.length
            ? Number(((eliteWins /
                elite.length) * 100).toFixed(2))
            : 0;
        // ====================================
        // LOW CONFIDENCE
        // ====================================
        const low = this.memory.filter(item => item.confidence < 60);
        const lowWins = low.filter(item => item.result === 'WIN').length;
        const lowConfidenceAccuracy = low.length
            ? Number(((lowWins /
                low.length) * 100).toFixed(2))
            : 0;
        // ====================================
        // RESULT
        // ====================================
        return {
            total,
            wins,
            losses,
            accuracy,
            roi,
            averageConfidence,
            eliteAccuracy,
            lowConfidenceAccuracy
        };
    }
}
exports.learningMemory = new LearningMemory();
