"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNumbersController = generateNumbersController;
exports.getUserHistoryController = getUserHistoryController;
exports.clearUserHistoryController = clearUserHistoryController;
exports.getRankingController = getRankingController;
exports.getHotColdController = getHotColdController;
const numbers_service_1 = require("./numbers.service");
const prisma_1 = __importDefault(require("../../database/prisma"));
// 🔢 GERAR
async function generateNumbersController(req, res) {
    try {
        const type = req.query.type;
        const amount = Number(req.query.amount);
        // 🔥 PEGAR PALAVRAS DO SONHO
        const wordsParam = req.query.words;
        const words = wordsParam
            ? wordsParam.split(",").map((w) => w.trim().toLowerCase())
            : [];
        // ✅ VALIDAÇÃO DE TIPO
        if (!type ||
            ![
                "milhar",
                "centena",
                "dezena",
                "grupo",
                "duque_grupo",
                "terno_grupo",
                "duque_dezena",
                "terno_dezena",
                "inversao_milhar",
                "cercado_dezena",
                "sonho",
            ].includes(type)) {
            return res.status(400).json({ error: "Tipo inválido" });
        }
        // 🔢 VALIDAÇÃO DE AMOUNT (exceto sonho)
        if (type !== "sonho") {
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: "amount inválido" });
            }
        }
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        // 🧠 SALVAR PALAVRAS DO SONHO (ANALYTICS)
        if (type === "sonho" && words.length > 0) {
            for (const word of words) {
                await prisma_1.default.dreamWord.upsert({
                    where: {
                        userId_word: {
                            userId: user.id,
                            word,
                        },
                    },
                    update: {
                        count: { increment: 1 },
                    },
                    create: {
                        userId: user.id,
                        word,
                        count: 1,
                    },
                });
            }
        }
        // 🔥 GERAR NÚMEROS
        const result = await (0, numbers_service_1.generateNumbersService)(type, amount || 1, {
            ...user,
            words,
        });
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({
            error: error.message || "Erro ao gerar números",
        });
    }
}
// 📜 HISTÓRICO
async function getUserHistoryController(req, res) {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const history = await (0, numbers_service_1.getUserHistoryService)(user);
        return res.json(history);
    }
    catch (error) {
        return res.status(500).json({
            error: "Erro interno",
        });
    }
}
// 🗑 LIMPAR HISTÓRICO
async function clearUserHistoryController(req, res) {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        await prisma_1.default.numberHistory.deleteMany({
            where: { userId: user.id },
        });
        return res.json({
            success: true,
            message: "Histórico apagado com sucesso",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "Erro ao limpar histórico",
        });
    }
}
// 🏆 RANKING
async function getRankingController(req, res) {
    try {
        const ranking = await (0, numbers_service_1.getRankingService)();
        return res.json(ranking);
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
}
// 🔥 HOT / COLD (NOVO)
async function getHotColdController(req, res) {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ error: "Não autenticado" });
        }
        const data = await (0, numbers_service_1.getHotColdNumbers)(user.id);
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({
            error: "Erro ao buscar números quente/frio",
        });
    }
}
