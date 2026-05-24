"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategy_registry_1 = require("../strategy.registry");
// ==========================================
// 🎲 RANDOM STRATEGY
// ==========================================
strategy_registry_1.StrategyRegistry.register({
    name: 'random',
    execute(context) {
        const results = [];
        for (let i = 0; i < 50; i++) {
            const number = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, '0');
            results.push({
                number,
                score: 50,
                strategy: 'random',
                tags: ['random']
            });
        }
        return results;
    }
});
