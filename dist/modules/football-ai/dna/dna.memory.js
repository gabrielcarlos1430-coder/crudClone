"use strict";
// src/modules/football-ai/dna/dna.memory.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dnaMemory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ======================================
// MEMORY
// ======================================
class DNAMemory {
    constructor() {
        this.file = path_1.default.resolve(process.cwd(), 'data/team-dna-memory.json');
        this.memory = new Map();
        this.load();
    }
    // ======================================
    // LOAD
    // ======================================
    load() {
        try {
            if (!fs_1.default.existsSync(this.file)) {
                return;
            }
            const raw = fs_1.default.readFileSync(this.file, 'utf-8');
            const parsed = JSON.parse(raw);
            for (const item of parsed) {
                this.memory.set(item.team, item);
            }
        }
        catch (error) {
            console.error('[DNA MEMORY LOAD ERROR]', error);
        }
    }
    // ======================================
    // SAVE
    // ======================================
    persist() {
        try {
            const data = JSON.stringify(this.all(), null, 2);
            const dir = path_1.default.dirname(this.file);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, {
                    recursive: true
                });
            }
            fs_1.default.writeFileSync(this.file, data, 'utf-8');
        }
        catch (error) {
            console.error('[DNA MEMORY SAVE ERROR]', error);
        }
    }
    // ======================================
    // GET
    // ======================================
    get(team) {
        return this.memory.get(team);
    }
    // ======================================
    // SET
    // ======================================
    set(team, dna) {
        this.memory.set(team, {
            ...dna,
            updatedAt: new Date()
                .toISOString()
        });
        this.persist();
    }
    // ======================================
    // HAS
    // ======================================
    has(team) {
        return this.memory.has(team);
    }
    // ======================================
    // DELETE
    // ======================================
    delete(team) {
        this.memory.delete(team);
        this.persist();
    }
    // ======================================
    // CLEAR
    // ======================================
    clear() {
        this.memory.clear();
        this.persist();
    }
    // ======================================
    // ALL
    // ======================================
    all() {
        return [
            ...this.memory.values()
        ];
    }
    // ======================================
    // TOP ATTACK
    // ======================================
    topOffensive(limit = 10) {
        return this
            .all()
            .sort((a, b) => b.offensiveDNA -
            a.offensiveDNA)
            .slice(0, limit);
    }
    // ======================================
    // TOP DEFENSE
    // ======================================
    topDefensive(limit = 10) {
        return this
            .all()
            .sort((a, b) => b.defensiveDNA -
            a.defensiveDNA)
            .slice(0, limit);
    }
    // ======================================
    // MOST CHAOTIC
    // ======================================
    mostChaotic(limit = 10) {
        return this
            .all()
            .sort((a, b) => b.chaosIndex -
            a.chaosIndex)
            .slice(0, limit);
    }
}
exports.dnaMemory = new DNAMemory();
