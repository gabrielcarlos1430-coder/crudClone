"use strict";
// src/modules/evolution/genetic-crossover.engine.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneticCrossoverEngine = void 0;
const strategy_registry_1 = require("../strategy-engine/strategy.registry");
const dna_factory_1 = require("./dna.factory");
// ==========================================
// 🧠 GENETIC CROSSOVER ENGINE
// ==========================================
class GeneticCrossoverEngine {
    // ==========================================
    // 🧬 EXECUTE CROSSOVER
    // ==========================================
    static evolve() {
        const strategies = strategy_registry_1.StrategyRegistry
            .getAll()
            .filter(s => s.dna);
        const created = [];
        // precisa de pelo menos 2
        if (strategies.length < 2) {
            return {
                created,
                totalStrategies: strategies.length
            };
        }
        // ==========================================
        // 🧬 RANDOM PAIRS
        // ==========================================
        for (let i = 0; i < 2; i++) {
            const parentA = this.randomStrategy(strategies);
            const parentB = this.randomStrategy(strategies);
            if (!parentA ||
                !parentB) {
                continue;
            }
            if (parentA.name ===
                parentB.name) {
                continue;
            }
            // ==========================================
            // 🧬 CHILD DNA
            // ==========================================
            const childDNA = this.crossoverDNA(parentA.dna, parentB.dna);
            // ==========================================
            // 👶 CHILD NAME
            // ==========================================
            const childName = `${parentA.name}_${parentB.name}_hybrid_${Date.now()}_${i}`;
            // evita duplicação
            if (strategy_registry_1.StrategyRegistry.get(childName)) {
                continue;
            }
            // ==========================================
            // 🧠 CHILD STRATEGY
            // ==========================================
            const child = {
                name: childName,
                dna: childDNA,
                lineage: {
                    generation: Math.max(parentA.lineage?.generation || 1, parentB.lineage?.generation || 1) + 1,
                    parent: `${parentA.name} + ${parentB.name}`,
                    species: 'hybrid'
                },
                execute(context) {
                    const history = context.history;
                    const results = [];
                    for (let x = 0; x < 10; x++) {
                        const base = history[Math.floor(Math.random() *
                            history.length)];
                        if (!base) {
                            continue;
                        }
                        const dna = childDNA;
                        const roll = Math.random();
                        let number = base.number;
                        // HOT BIAS
                        if (roll <
                            dna.hotBias) {
                            number =
                                '9' +
                                    number.slice(1);
                        }
                        // COLD BIAS
                        else if (roll <
                            (dna.hotBias +
                                dna.coldBias)) {
                            number =
                                '0' +
                                    number.slice(1);
                        }
                        // RANDOMNESS
                        if (Math.random() <
                            dna.randomness) {
                            number =
                                Math.floor(Math.random() * 10000)
                                    .toString()
                                    .padStart(4, '0');
                        }
                        results.push({
                            number,
                            strategy: childName,
                            score: dna.aggressiveness * 100,
                            tags: [
                                'hybrid',
                                parentA.name,
                                parentB.name
                            ]
                        });
                    }
                    return results;
                }
            };
            // ==========================================
            // 🧬 REGISTER
            // ==========================================
            strategy_registry_1.StrategyRegistry.register(child);
            created.push(childName);
        }
        // ==========================================
        // 📊 RESULT
        // ==========================================
        return {
            created,
            totalStrategies: strategy_registry_1.StrategyRegistry
                .getAll()
                .length
        };
    }
    // ==========================================
    // 🧬 DNA CROSSOVER
    // ==========================================
    static crossoverDNA(a, b) {
        const pick = (v1, v2) => {
            return Math.random() > 0.5
                ? v1
                : v2;
        };
        return dna_factory_1.DNAFactory.mutate({
            aggressiveness: pick(a.aggressiveness, b.aggressiveness),
            randomness: pick(a.randomness, b.randomness),
            hotBias: pick(a.hotBias, b.hotBias),
            coldBias: pick(a.coldBias, b.coldBias),
            mutationRate: pick(a.mutationRate, b.mutationRate),
            confidenceBias: pick(a.confidenceBias, b.confidenceBias),
            explorationRate: pick(a.explorationRate, b.explorationRate),
            clusterPreference: Math.random() > 0.5
                ? a.clusterPreference
                : b.clusterPreference
        });
    }
    // ==========================================
    // 🎲 RANDOM STRATEGY
    // ==========================================
    static randomStrategy(strategies) {
        return strategies[Math.floor(Math.random() *
            strategies.length)];
    }
}
exports.GeneticCrossoverEngine = GeneticCrossoverEngine;
