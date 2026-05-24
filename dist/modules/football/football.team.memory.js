"use strict";
// src/modules/football/football.team.memory.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.footballTeamMemory = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ======================================
// MEMORY ENGINE
// ======================================
class FootballTeamMemory {
    constructor() {
        this.file = path_1.default.resolve(process.cwd(), 'data/football-team-memory.json');
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
            console.log(`🧠 Team memory loaded: ${parsed.length} teams`);
        }
        catch (error) {
            console.error('❌ Error loading football team memory', error);
        }
    }
    // ======================================
    // PERSIST
    // ======================================
    persist() {
        try {
            const data = JSON.stringify(this.getAll(), null, 2);
            fs_1.default.writeFileSync(this.file, data);
        }
        catch (error) {
            console.error('❌ Error persisting football team memory', error);
        }
    }
    // ======================================
    // SAVE
    // ======================================
    save(analysis) {
        if (!analysis?.team) {
            return;
        }
        const current = this.memory.get(analysis.team);
        const updated = {
            team: analysis.team,
            matches: analysis.matches ?? 0,
            offensiveStrength: Number((analysis.offensiveStrength ?? 0).toFixed(2)),
            defensiveStrength: Number((analysis.defensiveStrength ?? 0).toFixed(2)),
            formScore: Number((analysis.formScore ?? 0).toFixed(2)),
            consistency: Number((analysis.consistency ?? 0).toFixed(2)),
            momentum: Number((analysis.momentum ?? 0).toFixed(2)),
            averageGoalsScored: Number((analysis.averageGoals ?? 0).toFixed(2)),
            averageGoalsConceded: Number((analysis.averageConceded ?? 0).toFixed(2)),
            cleanSheets: analysis.cleanSheets ?? 0,
            failedToScore: analysis.failedToScore ?? 0,
            recentForm: analysis.recentForm ?? [],
            updatedAt: Date.now()
        };
        this.memory.set(analysis.team, updated);
        this.persist();
        // ======================================
        // LOG ONLY WHEN CHANGED
        // ======================================
        const changed = !current ||
            current.formScore !==
                updated.formScore ||
            current.momentum !==
                updated.momentum;
        if (changed) {
            console.log(`🧠 Team memory updated: ${analysis.team}`);
        }
    }
    // ======================================
    // SAVE MANY
    // ======================================
    saveMany(analyses) {
        if (!Array.isArray(analyses)) {
            return;
        }
        for (const analysis of analyses) {
            this.save(analysis);
        }
        console.log(`🧠 Team memory batch updated: ${analyses.length} teams`);
    }
    // ======================================
    // GET
    // ======================================
    get(team) {
        return (this.memory.get(team)
            || null);
    }
    // ======================================
    // HAS
    // ======================================
    has(team) {
        return this.memory.has(team);
    }
    // ======================================
    // GET ALL
    // ======================================
    getAll() {
        return Array.from(this.memory.values());
    }
    // ======================================
    // TOP OFFENSIVE
    // ======================================
    getTopOffensive(limit = 10) {
        return this.getAll()
            .sort((a, b) => b.offensiveStrength -
            a.offensiveStrength)
            .slice(0, limit);
    }
    // ======================================
    // TOP DEFENSIVE
    // ======================================
    getTopDefensive(limit = 10) {
        return this.getAll()
            .sort((a, b) => b.defensiveStrength -
            a.defensiveStrength)
            .slice(0, limit);
    }
    // ======================================
    // TOP MOMENTUM
    // ======================================
    getTopMomentum(limit = 10) {
        return this.getAll()
            .sort((a, b) => b.momentum -
            a.momentum)
            .slice(0, limit);
    }
    // ======================================
    // WEAK DEFENSES
    // ======================================
    getWeakDefenses(limit = 10) {
        return this.getAll()
            .sort((a, b) => a.defensiveStrength -
            b.defensiveStrength)
            .slice(0, limit);
    }
    // ======================================
    // TOP FORM
    // ======================================
    getTopForm(limit = 10) {
        return this.getAll()
            .sort((a, b) => (b.formScore +
            b.momentum) -
            (a.formScore +
                a.momentum))
            .slice(0, limit);
    }
    // ======================================
    // STALE TEAMS
    // ======================================
    getStaleTeams(maxAgeMinutes = 180) {
        const now = Date.now();
        return this.getAll()
            .filter(team => {
            const age = now -
                team.updatedAt;
            return age >
                (maxAgeMinutes *
                    60 *
                    1000);
        });
    }
    // ======================================
    // CLEAR
    // ======================================
    clear() {
        this.memory.clear();
        this.persist();
        console.log('🧹 FootballTeamMemory limpo');
    }
}
// ======================================
// SINGLETON
// ======================================
exports.footballTeamMemory = new FootballTeamMemory();
