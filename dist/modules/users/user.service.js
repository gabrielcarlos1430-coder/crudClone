"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradePlan = exports.getUserStats = exports.remove = exports.updateRole = exports.update = exports.getById = exports.getAll = exports.getProfile = exports.create = void 0;
const prisma_1 = __importDefault(require("../../database/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const AppError_1 = require("../../shared/errors/AppError");
const SALT_ROUNDS = 10;
/**
 * 🔐 Criar usuário
 */
const create = async (data) => {
    const exists = await prisma_1.default.user.findUnique({
        where: { email: data.email },
        select: { id: true },
    });
    if (exists) {
        throw new AppError_1.AppError("Email já existe", 400);
    }
    if (data.role === client_1.Role.ADMIN) {
        throw new AppError_1.AppError("Não é permitido criar ADMIN diretamente", 403);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    return prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: client_1.Role.USER,
            plan: "FREE",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
            createdAt: true,
        },
    });
};
exports.create = create;
/**
 * 👤 Perfil
 */
const getProfile = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
            createdAt: true,
        },
    });
    if (!user)
        throw new AppError_1.AppError("Usuário não encontrado", 404);
    return user;
};
exports.getProfile = getProfile;
/**
 * 📋 LISTAGEM
 */
const getAll = async (page, limit, filters) => {
    const skip = (page - 1) * limit;
    const where = { AND: [] };
    if (filters?.search) {
        where.AND.push({
            OR: [
                { name: { contains: filters.search, mode: "insensitive" } },
                { email: { contains: filters.search, mode: "insensitive" } },
            ],
        });
    }
    const finalWhere = where.AND.length ? where : undefined;
    const [users, total] = await Promise.all([
        prisma_1.default.user.findMany({
            where: finalWhere,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                plan: true,
                createdAt: true,
            },
        }),
        prisma_1.default.user.count({ where: finalWhere }),
    ]);
    return {
        users,
        total,
        page,
        perPage: limit,
        lastPage: Math.ceil(total / limit),
    };
};
exports.getAll = getAll;
/**
 * 🔍 POR ID
 */
const getById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
            createdAt: true,
        },
    });
    if (!user)
        throw new AppError_1.AppError("Usuário não encontrado", 404);
    return user;
};
exports.getById = getById;
/**
 * ✏️ UPDATE
 */
const update = async (id, data) => {
    const user = await prisma_1.default.user.findUnique({ where: { id } });
    if (!user)
        throw new AppError_1.AppError("Usuário não encontrado", 404);
    const updateData = {};
    if (data.name)
        updateData.name = data.name;
    if (data.email)
        updateData.email = data.email;
    if (data.role)
        updateData.role = data.role;
    if (data.password) {
        updateData.password = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    }
    return prisma_1.default.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
            updatedAt: true,
        },
    });
};
exports.update = update;
/**
 * 🔁 ROLE
 */
const updateRole = async (id, role) => {
    const user = await prisma_1.default.user.findUnique({ where: { id } });
    if (!user)
        throw new AppError_1.AppError("Usuário não encontrado", 404);
    return prisma_1.default.user.update({
        where: { id },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true,
        },
    });
};
exports.updateRole = updateRole;
/**
 * 🗑 DELETE
 */
const remove = async (id) => {
    const user = await prisma_1.default.user.findUnique({ where: { id } });
    if (!user)
        throw new AppError_1.AppError("Usuário não encontrado", 404);
    await prisma_1.default.user.delete({ where: { id } });
    return { message: "Usuário deletado com sucesso" };
};
exports.remove = remove;
/**
 * 📊 STATS
 */
const getUserStats = async () => {
    const users = await prisma_1.default.user.findMany({
        select: {
            role: true,
            createdAt: true,
        },
    });
    const growthMap = {};
    for (const user of users) {
        const month = new Date(user.createdAt).toLocaleString("pt-BR", {
            month: "short",
        });
        growthMap[month] = (growthMap[month] || 0) + 1;
    }
    const growth = Object.entries(growthMap).map(([name, users]) => ({
        name,
        users,
    }));
    return {
        growth,
        roles: {
            ADMIN: users.filter((u) => u.role === client_1.Role.ADMIN).length,
            USER: users.filter((u) => u.role === client_1.Role.USER).length,
        },
    };
};
exports.getUserStats = getUserStats;
/**
 * 🚀 UPGRADE PARA PRO (🔥 FALTAVA ISSO AQUI)
 */
const upgradePlan = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.AppError("Usuário não encontrado", 404);
    }
    return prisma_1.default.user.update({
        where: { id: userId },
        data: { plan: "PRO" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            plan: true,
            updatedAt: true,
        },
    });
};
exports.upgradePlan = upgradePlan;
