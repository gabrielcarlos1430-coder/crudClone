"use strict";
// src/modules/football-ai/engines/alert.pipeline.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertPipeline = void 0;
const alert_scoring_engine_1 = require("./alert.scoring.engine");
const ws_server_1 = require("../../../shared/websocket/ws.server");
// ======================================
// 🚨 ALERT PIPELINE
// ======================================
class AlertPipeline {
    // ======================================
    // 🚀 PROCESS ALL ALERTS
    // ======================================
    static process(alerts) {
        if (!alerts || alerts.length === 0)
            return;
        // ======================================
        // 🧠 SCORE + FILTER
        // ======================================
        const scored = alerts.map(a => alert_scoring_engine_1.AlertScoringEngine.score(a));
        const filtered = scored.filter(a => a.score >= 65);
        // ======================================
        // 📊 SAVE BUFFER
        // ======================================
        this.buffer.unshift(...filtered);
        if (this.buffer.length > this.MAX_BUFFER) {
            this.buffer = this.buffer.slice(0, this.MAX_BUFFER);
        }
        // ======================================
        // 📡 BROADCAST STRATEGY
        // ======================================
        for (const alert of filtered) {
            // 🔥 ELITE ALERTS = instant push
            if (alert.quality === 'ELITE') {
                (0, ws_server_1.broadcastAlert)({
                    ...alert,
                    priority: 'ELITE',
                });
                continue;
            }
            // ⚡ HIGH ALERTS = normal push
            if (alert.quality === 'HIGH') {
                (0, ws_server_1.broadcastAlert)({
                    ...alert,
                    priority: 'HIGH',
                });
                continue;
            }
            // 🟡 MEDIUM = batch delayed (anti-spam)
            if (alert.quality === 'MEDIUM') {
                setTimeout(() => {
                    (0, ws_server_1.broadcastAlert)({
                        ...alert,
                        priority: 'MEDIUM',
                    });
                }, 2000);
                continue;
            }
        }
        console.log(`📡 Pipeline: ${filtered.length} alerts enviados | buffer=${this.buffer.length}`);
    }
    // ======================================
    // 🔥 GET ELITE FEED
    // ======================================
    static getEliteFeed(limit = 20) {
        return this.buffer
            .filter(a => a.quality === 'ELITE')
            .slice(0, limit);
    }
    // ======================================
    // 📊 GET ALL SCORED ALERTS
    // ======================================
    static getAll(limit = 50) {
        return this.buffer.slice(0, limit);
    }
    // ======================================
    // 🧹 CLEAR PIPELINE
    // ======================================
    static clear() {
        this.buffer = [];
        console.log('🧹 AlertPipeline limpo');
    }
}
exports.AlertPipeline = AlertPipeline;
AlertPipeline.buffer = [];
AlertPipeline.MAX_BUFFER = 200;
