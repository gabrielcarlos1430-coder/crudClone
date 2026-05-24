"use strict";
// src/modules/football-ai/neural/neural-trade.optimizer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeuralTradeOptimizer = void 0;
class NeuralTradeOptimizer {
    // ======================================
    // 📥 REGISTER TRADE RESULT
    // ======================================
    static registerTradeResult(position) {
        const type = position.type;
        if (!this.memory.has(type)) {
            this.memory.set(type, {
                type,
                weight: 1,
                wins: 0,
                losses: 0,
                total: 0,
                profit: 0,
            });
        }
        const node = this.memory.get(type);
        node.total++;
        if (position.status === 'WIN') {
            node.wins++;
            node.profit += position.expectedProfit;
        }
        if (position.status === 'LOSS') {
            node.losses++;
            node.profit -= position.stake;
        }
        // ======================================
        // 🧠 UPDATE WEIGHT (CORE NEURAL LOGIC)
        // ======================================
        const winRate = node.wins / node.total;
        const profitFactor = node.profit / Math.max(1, node.total);
        // fórmula neural simples e eficiente
        const targetWeight = (winRate * 0.7 + profitFactor * 0.3);
        node.weight =
            node.weight +
                this.learningRate * (targetWeight - node.weight);
        // clamp de segurança
        node.weight = Math.max(0.1, Math.min(3, node.weight));
    }
    // ======================================
    // 📊 SCORE ADJUSTMENT
    // ======================================
    static adjustScore(type, baseScore) {
        const node = this.memory.get(type);
        if (!node)
            return baseScore;
        return Number((baseScore * node.weight).toFixed(2));
    }
    // ======================================
    // 🔥 GET BEST STRATEGIES
    // ======================================
    static getTopStrategies(limit = 10) {
        return Array.from(this.memory.values())
            .sort((a, b) => b.weight - a.weight)
            .slice(0, limit);
    }
    // ======================================
    // 📉 GET WORST STRATEGIES
    // ======================================
    static getWeakStrategies(limit = 10) {
        return Array.from(this.memory.values())
            .sort((a, b) => a.weight - b.weight)
            .slice(0, limit);
    }
    // ======================================
    // 📈 GLOBAL INSIGHTS
    // ======================================
    static getInsights() {
        const all = Array.from(this.memory.values());
        const totalTrades = all.reduce((acc, s) => acc + s.total, 0);
        const totalProfit = all.reduce((acc, s) => acc + s.profit, 0);
        const avgWeight = all.length > 0
            ? all.reduce((acc, s) => acc + s.weight, 0) / all.length
            : 1;
        return {
            strategiesTracked: all.length,
            totalTrades,
            totalProfit: Number(totalProfit.toFixed(2)),
            avgStrategyWeight: Number(avgWeight.toFixed(3)),
        };
    }
    // ======================================
    // 🧹 RESET
    // ======================================
    static reset() {
        this.memory.clear();
        console.log('🧹 NeuralTradeOptimizer resetado');
    }
}
exports.NeuralTradeOptimizer = NeuralTradeOptimizer;
// memória neural por tipo de trade
NeuralTradeOptimizer.memory = new Map();
NeuralTradeOptimizer.learningRate = 0.08;
