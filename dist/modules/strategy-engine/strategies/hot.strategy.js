"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategy_registry_1 = require("../strategy.registry");
// ==========================================
// 🔥 HOT STRATEGY
// ==========================================
strategy_registry_1.StrategyRegistry.register({
    name: 'hot',
    execute(context) {
        const frequency = new Map();
        for (const item of context.history) {
            frequency.set(item.number, (frequency.get(item.number) || 0) + 1);
        }
        const sorted = Array.from(frequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50);
        return sorted.map(([number, count]) => ({
            number,
            score: count * 10,
            strategy: 'hot',
            tags: ['hot']
        }));
    }
});
