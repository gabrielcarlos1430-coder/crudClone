"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertStreamBootstrap = void 0;
const market_feed_engine_1 = require("../modules/football-ai/engines/market-feed.engine");
const value_bet_engine_1 = require("../modules/football-ai/engines/value-bet.engine");
const alert_engine_1 = require("../modules/football-ai/engines/alert.engine");
const alert_pipeline_engine_1 = require("../modules/football-ai/pipeline/alert-pipeline.engine");
const unified_ai_trading_core_1 = require("../modules/football-ai/core/unified-ai-trading.core");
const ws_server_1 = require("../shared/websocket/ws.server");
class AlertStreamBootstrap {
    static start() {
        console.log('🚀 PRODUCTION MODE ENABLED');
        setInterval(async () => {
            // ======================================
            // 📡 REAL MARKET DATA
            // ======================================
            const odds = await market_feed_engine_1.MarketFeedEngine.fetchLiveOdds();
            // ======================================
            // 🧠 VALUE BET ENGINE REAL
            // ======================================
            const valueBets = odds.map(o => value_bet_engine_1.ValueBetEngine.analyze({
                homeTeam: o.homeTeam,
                awayTeam: o.awayTeam,
                prediction: 'UNKNOWN',
                market: o.market,
                confidence: 70,
                fairOdd: o.homeOdd,
            }));
            // ======================================
            // 🚨 ALERT ENGINE
            // ======================================
            alert_engine_1.AlertEngine.analyzeValueBets(valueBets);
            const alerts = alert_engine_1.AlertEngine.getAlerts(50);
            const processed = alert_pipeline_engine_1.AlertPipelineV6.process(alerts);
            unified_ai_trading_core_1.UnifiedAITradingCore.ingestAlerts(processed);
            // ======================================
            // 📡 LIVE STREAM
            // ======================================
            (0, ws_server_1.broadcast)('football:stream', {
                mode: 'PRODUCTION',
                alerts: processed.slice(0, 5),
                timestamp: Date.now(),
            });
        }, 2000);
    }
}
exports.AlertStreamBootstrap = AlertStreamBootstrap;
