"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestratorController = void 0;
const orchestrator_service_1 = require("./orchestrator.service");
const history_memory_1 = require("../history/history.memory");
// ==========================================
// 🧠 ORCHESTRATOR CONTROLLER
// ==========================================
class OrchestratorController {
    // ==========================================
    // 🚀 EXECUTA PIPELINE
    // ==========================================
    static async run(req, res) {
        try {
            let { history } = req.body;
            // ==========================================
            // 🔥 AUTO HISTORY
            // ==========================================
            if (!history ||
                !Array.isArray(history)) {
                history =
                    history_memory_1.HistoryMemory.getNumbers();
                console.log('🧠 Histórico carregado da memória:', history.length);
            }
            // ==========================================
            // 🚀 ORCHESTRATOR
            // ==========================================
            const result = await orchestrator_service_1.OrchestratorService.run(history);
            // ==========================================
            // ✅ RESPONSE PADRONIZADO
            // ==========================================
            return res.status(200).json({
                success: true,
                timestamp: new Date(),
                data: result
            });
        }
        catch (error) {
            console.error('🔴 Orchestrator Error:', error);
            return res.status(500).json({
                success: false,
                message: error.message ||
                    'Erro interno no orchestrator'
            });
        }
    }
}
exports.OrchestratorController = OrchestratorController;
