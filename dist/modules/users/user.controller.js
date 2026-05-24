"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradePlan = exports.stats = exports.deleteUser = exports.updateUserRole = exports.updateUser = exports.getUser = exports.getUsers = exports.me = exports.createUser = void 0;
const service = __importStar(require("./user.service"));
/**
 * 🔐 Criar usuário
 */
const createUser = async (req, res) => {
    try {
        const user = await service.create(req.body);
        return res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message || "Erro ao criar usuário",
        });
    }
};
exports.createUser = createUser;
/**
 * 👤 Perfil logado
 */
const me = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await service.getProfile(userId);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 404).json({
            success: false,
            error: err.message || "Usuário não encontrado",
        });
    }
};
exports.me = me;
/**
 * 📋 Listagem
 */
const getUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await service.getAll(page, limit, req.query);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message || "Erro ao listar usuários",
        });
    }
};
exports.getUsers = getUsers;
/**
 * 🔍 Buscar por ID
 */
const getUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID inválido",
            });
        }
        const user = await service.getById(id);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 404).json({
            success: false,
            error: err.message || "Usuário não encontrado",
        });
    }
};
exports.getUser = getUser;
/**
 * ✏️ Atualizar usuário (ADMIN)
 */
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID inválido",
            });
        }
        const user = await service.update(id, req.body);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message || "Erro ao atualizar usuário",
        });
    }
};
exports.updateUser = updateUser;
/**
 * 🔁 Alterar role
 */
const updateUserRole = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID inválido",
            });
        }
        const { role } = req.body;
        const user = await service.updateRole(id, role);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message || "Erro ao atualizar role",
        });
    }
};
exports.updateUserRole = updateUserRole;
/**
 * 🗑 Deletar usuário
 */
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "ID inválido",
            });
        }
        const result = await service.remove(id);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message || "Erro ao deletar usuário",
        });
    }
};
exports.deleteUser = deleteUser;
/**
 * 📊 Stats
 */
const stats = async (req, res) => {
    try {
        const data = await service.getUserStats();
        return res.json({
            success: true,
            data,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message || "Erro ao buscar estatísticas",
        });
    }
};
exports.stats = stats;
/**
 * 🚀 UPGRADE PARA PRO
 */
const upgradePlan = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Usuário não autenticado",
            });
        }
        const user = await service.upgradePlan(userId);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch (err) {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message || "Erro ao atualizar plano",
        });
    }
};
exports.upgradePlan = upgradePlan;
