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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const controller = __importStar(require("./user.controller"));
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const role_middleware_1 = require("../../shared/middlewares/role.middleware");
const permission_middleware_1 = require("../../shared/middlewares/permission.middleware");
const validate_middleware_1 = require("../../shared/middlewares/validate.middleware");
const user_schema_1 = require("./user.schema");
const router = (0, express_1.Router)();
/**
 * 🆓 REGISTRO PÚBLICO (FRONTEND)
 */
router.post("/register", (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), controller.createUser);
/**
 * 🔐 ADMIN CREATE (PROTEGIDO)
 */
router.post("/admin", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), (0, permission_middleware_1.permissionMiddleware)("user:create"), (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), controller.createUser);
/**
 * 👤 ME
 */
router.get("/me", auth_middleware_1.authMiddleware, controller.me);
/**
 * 📊 STATS
 */
router.get("/stats", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), (0, permission_middleware_1.permissionMiddleware)("user:read"), controller.stats);
/**
 * 📋 USERS
 */
router.get("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), (0, permission_middleware_1.permissionMiddleware)("user:read"), controller.getUsers);
router.get("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), (0, permission_middleware_1.permissionMiddleware)("user:read"), controller.getUser);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), (0, permission_middleware_1.permissionMiddleware)("user:update"), (0, validate_middleware_1.validate)(user_schema_1.updateUserSchema), controller.updateUser);
router.patch("/:id/role", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), (0, permission_middleware_1.permissionMiddleware)("user:update"), controller.updateUserRole);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)(client_1.Role.ADMIN), (0, permission_middleware_1.permissionMiddleware)("user:delete"), controller.deleteUser);
/**
 * 🚀 UPGRADE
 */
router.patch("/upgrade", auth_middleware_1.authMiddleware, controller.upgradePlan);
exports.default = router;
