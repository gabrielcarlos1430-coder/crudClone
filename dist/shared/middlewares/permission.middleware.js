"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionMiddleware = permissionMiddleware;
const prisma_1 = __importDefault(require("../../database/prisma"));
const redis_1 = require("../config/redis");
const CACHE_PREFIX = 'permissions:';
const CACHE_TTL = 60 * 10; // 10 minutos
function permissionMiddleware(permissionName) {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Não autenticado',
                });
            }
            const role = user.role;
            const cacheKey = CACHE_PREFIX + role;
            let permissions = null;
            // 🔥 1. tenta Redis (com segurança)
            try {
                if (redis_1.redis) {
                    const cached = await redis_1.redis.get(cacheKey);
                    if (cached) {
                        const parsed = JSON.parse(cached);
                        if (Array.isArray(parsed)) {
                            permissions = parsed;
                        }
                    }
                }
            }
            catch (err) {
                console.warn('Redis falhou, indo para DB');
            }
            // 🔥 2. se não tem cache válido → banco
            if (!permissions) {
                const rolePermissions = await prisma_1.default.rolePermission.findMany({
                    where: { role },
                    include: {
                        permission: true,
                    },
                });
                permissions = rolePermissions
                    .map((rp) => rp.permission?.name)
                    .filter(Boolean);
                // 🔥 salva cache apenas se válido
                if (redis_1.redis && permissions.length > 0) {
                    await redis_1.redis.set(cacheKey, JSON.stringify(permissions), 'EX', CACHE_TTL);
                }
            }
            // 🧠 DEBUG
            console.log({
                role,
                permissionRequired: permissionName,
                permissionsLoaded: permissions,
            });
            // 🔥 3. segurança extra: ADMIN bypass opcional (recomendado)
            if (role === 'ADMIN') {
                return next();
            }
            // 🔥 4. valida permissão
            if (!permissions.includes(permissionName)) {
                return res.status(403).json({
                    success: false,
                    error: 'Acesso negado',
                });
            }
            return next();
        }
        catch (error) {
            console.error('Erro no permissionMiddleware:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro ao verificar permissão',
            });
        }
    };
}
