"use strict";
// src/shared/websocket/ws.server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocket = initWebSocket;
exports.broadcast = broadcast;
exports.sendToUser = sendToUser;
exports.sendToRole = sendToRole;
exports.broadcastAlert = broadcastAlert;
exports.broadcastFootball = broadcastFootball;
exports.broadcastOrchestrator = broadcastOrchestrator;
const ws_1 = require("ws");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ==========================================
// 🚀 SERVER
// ==========================================
let wss = null;
// ==========================================
// 👥 CLIENTS
// ==========================================
const clients = new Set();
// ==========================================
// 🚀 INIT WS SERVER
// ==========================================
function initWebSocket(server) {
    wss = new ws_1.WebSocketServer({
        server,
        path: '/ws',
        perMessageDeflate: false
    });
    wss.on('connection', (ws, req) => {
        const url = new URL(req.url || '', 'http://localhost');
        const token = url.searchParams.get('token');
        if (!token) {
            console.log('🔴 WS sem token');
            ws.close(4001, 'No token');
            return;
        }
        let decoded;
        // ==========================================
        // 🔐 SAFE JWT VERIFY
        // ==========================================
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            if (error?.name === 'TokenExpiredError') {
                console.log('🟡 WS token expirado');
                ws.close(4002, 'Token expired');
                return;
            }
            console.log('🔴 WS token inválido');
            ws.close(4003, 'Invalid token');
            return;
        }
        // ==========================================
        // 👤 USER VALIDATION
        // ==========================================
        const userId = Number(decoded?.sub);
        if (!userId) {
            console.log('🔴 WS token sem userId');
            ws.close(4004, 'Invalid payload');
            return;
        }
        // ==========================================
        // 👤 CLIENT REGISTER
        // ==========================================
        const client = {
            ws,
            userId,
            role: decoded.role
        };
        clients.add(client);
        console.log(`🟢 WS CONNECTED USER ${userId}`);
        // ==========================================
        // 📨 CONNECTED EVENT
        // ==========================================
        ws.send(JSON.stringify({
            type: 'system',
            data: {
                status: 'connected',
                userId
            },
            timestamp: Date.now()
        }));
        // ==========================================
        // 📨 MESSAGE HANDLER
        // ==========================================
        ws.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw.toString());
                if (msg.type === 'ping') {
                    ws.send(JSON.stringify({ type: 'pong' }));
                    return;
                }
            }
            catch (error) {
                console.error('❌ WS MESSAGE ERROR:', error);
            }
        });
        // ==========================================
        // ❌ ERROR
        // ==========================================
        ws.on('error', (err) => {
            console.log('🔴 WS CLIENT ERROR:', err);
        });
        // ==========================================
        // 🔌 CLOSE
        // ==========================================
        ws.on('close', () => {
            clients.delete(client);
            console.log(`🔌 WS DISCONNECTED USER ${userId}`);
        });
    });
    console.log('✅ WebSocket Server iniciado');
    return wss;
}
// ==========================================
// 📡 BROADCAST GLOBAL
// ==========================================
function broadcast(event, data) {
    if (!wss) {
        console.log('⚠️ WS ainda não inicializado');
        return;
    }
    const payload = JSON.stringify({
        type: event,
        data,
        timestamp: Date.now()
    });
    clients.forEach(client => {
        if (client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(payload);
        }
    });
}
// ==========================================
// 👤 SEND TO USER
// ==========================================
function sendToUser(userId, event, data) {
    const payload = JSON.stringify({
        type: event,
        data,
        timestamp: Date.now()
    });
    clients.forEach(client => {
        if (client.userId === userId &&
            client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(payload);
        }
    });
}
// ==========================================
// 👑 SEND TO ROLE
// ==========================================
function sendToRole(role, event, data) {
    const payload = JSON.stringify({
        type: event,
        data,
        timestamp: Date.now()
    });
    clients.forEach(client => {
        if (client.role === role &&
            client.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(payload);
        }
    });
}
// ==========================================
// 🚨 ALERT COMPAT LAYER
// ==========================================
function broadcastAlert(alert) {
    broadcast('football:alert', alert);
}
// ==========================================
// ⚽ COMPAT LAYER
// ==========================================
function broadcastFootball(data) {
    broadcast('football', data);
}
function broadcastOrchestrator(data) {
    broadcast('orchestrator', data);
}
