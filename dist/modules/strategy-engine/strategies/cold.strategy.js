"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategy_registry_1 = require("../strategy.registry");
// ==========================================
// ❄️ COLD STRATEGY
// ==========================================
strategy_registry_1.StrategyRegistry.register({
    name: 'cold',
    execute(context) {
        const seen = new Set(context.history.map(h => h.number));
        const results = [];
        while (results.length < 50) {
            const number = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, '0');
            if (!seen.has(number)) {
                results.push({
                    number,
                    score: 80,
                    strategy: 'cold',
                    tags: ['cold']
                });
            }
        }
        return results;
    }
});
