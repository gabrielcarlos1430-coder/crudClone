"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeService = getMeService;
const prisma_1 = __importDefault(require("../../database/prisma"));
async function getMeService(userId) {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
            isActive: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    return user;
}
