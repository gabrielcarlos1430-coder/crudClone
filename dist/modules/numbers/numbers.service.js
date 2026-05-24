"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNumbersService = generateNumbersService;
exports.getHotColdNumbers = getHotColdNumbers;
exports.getUserHistoryService = getUserHistoryService;
exports.getRankingService = getRankingService;
const scraper_1 = require("../../utils/scraper");
const extractor_1 = require("../../utils/extractor");
const generator_1 = require("../../utils/generator");
const group_adapter_1 = require("./adapters/group.adapter");
const duqueGrupo_adapter_1 = require("./adapters/duqueGrupo.adapter");
const ternoGrupo_adapter_1 = require("./adapters/ternoGrupo.adapter");
const duqueDezena_adapter_1 = require("./adapters/duqueDezena.adapter");
const ternoDezena_adapter_1 = require("./adapters/ternoDezena.adapter");
const inversaoMilhar_adapter_1 = require("./adapters/inversaoMilhar.adapter");
const cercadoDezena_adapter_1 = require("./adapters/cercadoDezena.adapter");
const sonho_adapter_1 = require("./adapters/sonho.adapter");
const prisma_1 = __importDefault(require("../../database/prisma"));
function getUserLimits(plan) {
    const normalizedPlan = (plan || "FREE").toUpperCase();
    if (normalizedPlan === "PRO") {
        return {
            maxAmount: 1000,
            maxHistory: 50,
            maxPerDay: 100,
            plan: "PRO",
        };
    }
    return {
        maxAmount: 5,
        maxHistory: 10,
        maxPerDay: 5,
        plan: "FREE",
    };
}
function getStartOfDay() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}
function normalizeNumbers(numbers) {
    if (!Array.isArray(numbers))
        return [];
    return numbers.map((n) => {
        if (typeof n === "string")
            return n;
        if (Array.isArray(n))
            return n.join("-");
        if (typeof n === "object")
            return JSON.stringify(n);
        return String(n);
    });
}
async function generateNumbersService(type, amount, user) {
    const limits = getUserLimits(user.plan);
    if (amount <= 0)
        throw new Error("Quantidade inválida");
    if (amount > limits.maxAmount) {
        throw new Error(`Plano ${limits.plan}: máximo ${limits.maxAmount} números por geração`);
    }
    if (user.plan !== "PRO" &&
        !["milhar", "centena", "dezena"].includes(type)) {
        throw new Error("Disponível apenas no plano PRO");
    }
    const today = getStartOfDay();
    const todayUsage = await prisma_1.default.usage.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
    });
    if (todayUsage && todayUsage.count >= limits.maxPerDay) {
        throw new Error("Limite diário atingido");
    }
    const html = await (0, scraper_1.getNumbersFromPage)();
    const milhares = (0, extractor_1.extractMilhar)(html);
    if (!milhares.length) {
        throw new Error("Nenhum número encontrado");
    }
    let result = [];
    if (["milhar", "centena", "dezena"].includes(type)) {
        result = (0, generator_1.generateNumbers)(milhares, type, amount);
    }
    else {
        const dezenas = (0, generator_1.generateNumbers)(milhares, "dezena", amount);
        const milharesGeradas = (0, generator_1.generateNumbers)(milhares, "milhar", amount);
        switch (type) {
            case "grupo":
                result = (0, group_adapter_1.generateGrupo)(dezenas);
                break;
            case "duque_grupo":
                result = (0, duqueGrupo_adapter_1.generateDuqueGrupo)((0, group_adapter_1.generateGrupo)(dezenas).map((g) => g.grupo));
                break;
            case "terno_grupo":
                result = (0, ternoGrupo_adapter_1.generateTernoGrupo)((0, group_adapter_1.generateGrupo)(dezenas).map((g) => g.grupo));
                break;
            case "duque_dezena":
                result = (0, duqueDezena_adapter_1.generateDuqueDezena)(dezenas);
                break;
            case "terno_dezena":
                result = (0, ternoDezena_adapter_1.generateTernoDezena)(dezenas);
                break;
            case "inversao_milhar":
                result = (0, inversaoMilhar_adapter_1.generateInversaoMilhar)(milharesGeradas);
                break;
            case "cercado_dezena":
                result = (0, cercadoDezena_adapter_1.generateCercadoDezena)(dezenas);
                break;
            case "sonho":
                result = await (0, sonho_adapter_1.generateSonho)(user.words || [], user.id);
                break;
            default:
                throw new Error("Tipo inválido");
        }
    }
    if (!Array.isArray(result))
        result = [];
    await prisma_1.default.numberHistory.create({
        data: {
            userId: user.id,
            numbers: normalizeNumbers(result),
        },
    });
    await prisma_1.default.usage.upsert({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
        update: { count: { increment: 1 } },
        create: {
            userId: user.id,
            date: today,
            count: 1,
        },
    });
    return {
        numbers: result,
        plan: limits.plan,
        limits,
        usage: {
            today: (todayUsage?.count || 0) + 1,
            max: limits.maxPerDay,
        },
    };
}
// 🔥 HOT / COLD
async function getHotColdNumbers(userId) {
    const allHistory = await prisma_1.default.numberHistory.findMany({
        select: { numbers: true, userId: true },
    });
    const globalFreq = {};
    const userFreq = {};
    for (const item of allHistory) {
        for (const num of item.numbers) {
            globalFreq[num] = (globalFreq[num] || 0) + 1;
            if (item.userId === userId) {
                userFreq[num] = (userFreq[num] || 0) + 1;
            }
        }
    }
    function getTop(freq, asc = false) {
        return Object.entries(freq)
            .sort((a, b) => (asc ? a[1] - b[1] : b[1] - a[1]))
            .slice(0, 5)
            .map(([num]) => num);
    }
    return {
        global: {
            hot: getTop(globalFreq),
            cold: getTop(globalFreq, true),
        },
        user: {
            hot: getTop(userFreq),
            cold: getTop(userFreq, true),
        },
    };
}
async function getUserHistoryService(user) {
    const limits = getUserLimits(user.plan);
    const history = await prisma_1.default.numberHistory.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: limits.maxHistory,
    });
    return history.map((item) => item.numbers);
}
async function getRankingService() {
    return await prisma_1.default.numberHistory.groupBy({
        by: ["userId"],
        _count: { userId: true },
        orderBy: { _count: { userId: "desc" } },
        take: 10,
    });
}
