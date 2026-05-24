"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const redis_1 = require("./shared/config/redis");
const history_realtime_1 = require("./modules/history/history.realtime");
const learning_memory_1 = require("./modules/auto-learning/learning.memory");
const draw_sync_service_1 = require("./modules/draw-sync/draw-sync.service");
const source_weight_engine_1 = require("./modules/analytics/source-weight.engine");
const football_realtime_1 = require("./modules/football/football.realtime");
const ws_server_1 = require("./shared/websocket/ws.server");
const orchestrator_realtime_1 = require("./modules/ai-orchestrator/orchestrator.realtime");
// 🚨 ALERT STREAM (NOVA CAMADA PRODUÇÃO)
const alert_stream_bootstrap_1 = require("./bootstrap/alert-stream.bootstrap");
const PORT = Number(process.env.PORT) || 3000;
// ==========================================
// 🚀 SERVER START
// ==========================================
async function startServer() {
    try {
        console.log('🔥 REDIS_URL:', process.env.REDIS_URL || 'não configurado');
        // ==========================================
        // 🔴 REDIS
        // ==========================================
        if (redis_1.redis) {
            try {
                await redis_1.redis.set('test', 'ok');
                const value = await redis_1.redis.get('test');
                console.log('🟢 Redis conectado:', value);
            }
            catch {
                console.log('🟡 Redis não conectado (continuando sem ele)');
            }
        }
        // ==========================================
        // 🧠 AI MEMORY
        // ==========================================
        await learning_memory_1.LearningMemory.initialize();
        console.log('🧠 LearningMemory inicializada');
        console.log('⚖️ Source Weights:', source_weight_engine_1.SourceWeightEngine.getAll());
        // ==========================================
        // 📡 SYNC DATA
        // ==========================================
        await draw_sync_service_1.DrawSyncService.syncMegaSena();
        console.log('🎰 Mega-Sena sincronizada');
        // ==========================================
        // 🚀 HTTP SERVER
        // ==========================================
        const server = http_1.default.createServer(app_1.default);
        // ==========================================
        // ⚡ WEBSOCKET
        // ==========================================
        const wss = (0, ws_server_1.initWebSocket)(server);
        console.log('⚡ WebSocket inicializado');
        // ==========================================
        // 🚨 ALERT STREAM (PRODUÇÃO REAL CORE)
        // ==========================================
        await alert_stream_bootstrap_1.AlertStreamBootstrap.start({
            websocket: wss,
            mode: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
        });
        console.log('🚨 AlertStreamBootstrap iniciado');
        // ==========================================
        // 🚀 REALTIME ENGINES
        // ==========================================
        history_realtime_1.HistoryRealtimeEngine.start();
        console.log('📡 HistoryRealtimeEngine iniciado');
        football_realtime_1.FootballRealtime.start();
        console.log('⚽ FootballRealtime iniciado');
        orchestrator_realtime_1.OrchestratorRealtime.start();
        console.log('🧠 OrchestratorRealtime iniciado');
        // ==========================================
        // 🚀 SERVER LISTEN
        // ==========================================
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📘 Health: /health`);
            console.log(`⚡ WebSocket ativo: ws://localhost:${PORT}/ws`);
            console.log(`🔌 WS clients conectados: ${wss?.clients?.size || 0}`);
            console.log(`🔥 MODE: ${process.env.NODE_ENV || 'development'}`);
        });
        // ==========================================
        // 🔌 DEBUG CLIENTS
        // ==========================================
        setInterval(() => {
            console.log(`🔌 WS clients ativos: ${wss?.clients?.size || 0}`);
        }, 15000);
    }
    catch (error) {
        console.error('🔴 Erro ao iniciar servidor:', error);
    }
}
// ==========================================
// 🚀 AUTO START
// ==========================================
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
