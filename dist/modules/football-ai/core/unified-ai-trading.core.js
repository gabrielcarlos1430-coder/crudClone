"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedAITradingCore = void 0;
const alert_pipeline_engine_1 = require("../pipeline/alert-pipeline.engine");
const neural_strategy_switcher_1 = require("../neural/neural-strategy.switcher");
const neural_trade_optimizer_1 = require("../neural/neural-trade.optimizer");
const auto_trade_simulator_1 = require("../simulators/auto-trade.simulator");
// ======================================
// 🧠 UNIFIED CORE V6
// ======================================
class UnifiedAITradingCore {
    static init() {
        if (this.initialized)
            return;
        this.initialized = true;
        neural_strategy_switcher_1.NeuralStrategySwitcherV6.init();
        console.log('🧠 CORE V6 ONLINE');
    }
    static ingestAlerts(alerts) {
        this.alertBuffer.push(...alerts);
        this.process();
    }
    static async process() {
        if (this.processing)
            return;
        this.processing = true;
        try {
            if (!this.alertBuffer.length)
                return;
            const processed = alert_pipeline_engine_1.AlertPipelineV6.process(this.alertBuffer);
            this.alertBuffer = [];
            const valid = processed.filter(a => a.allowed);
            if (!valid.length)
                return;
            const forecast = neural_strategy_switcher_1.NeuralStrategySwitcherV6.forecast();
            const strategy = this.pickStrategy(forecast);
            for (const alert of valid) {
                const adjusted = neural_trade_optimizer_1.NeuralTradeOptimizer.adjustScore(alert.type, alert.finalScore);
                const final = neural_strategy_switcher_1.NeuralStrategySwitcherV6.modifyScore(adjusted, strategy);
                auto_trade_simulator_1.AutoTradeSimulator.generateFromAlert({
                    ...alert,
                    score: final,
                });
            }
        }
        finally {
            this.processing = false;
        }
    }
    static pickStrategy(forecast) {
        const alloc = forecast?.allocation || {};
        return (Object.keys(alloc).reduce((a, b) => alloc[a] > alloc[b] ? a : b) || 'BALANCED');
    }
}
exports.UnifiedAITradingCore = UnifiedAITradingCore;
UnifiedAITradingCore.initialized = false;
UnifiedAITradingCore.alertBuffer = [];
UnifiedAITradingCore.processing = false;
