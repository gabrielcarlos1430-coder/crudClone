"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
/**
 * Criar usuário
 */
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Nome muito curto"),
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "Senha muito fraca"),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
});
/**
 * Atualizar usuário (CORRIGIDO)
 */
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Nome muito curto").optional(),
    email: zod_1.z.string().email("Email inválido").optional(),
    password: zod_1.z.string().min(6, "Senha muito fraca").optional(),
    role: zod_1.z.nativeEnum(client_1.Role).optional(), // 🔥 ESSENCIAL
});
