"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        console.log("ROLE CHECK:", {
            userRole: user?.role,
            allowedRoles,
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Não autenticado",
            });
        }
        // 🔥 NORMALIZAÇÃO (EVITA BUG SILENCIOSO)
        const userRole = user.role?.toUpperCase();
        const allowed = allowedRoles.map(r => r.toUpperCase());
        if (!allowed.includes(userRole)) {
            return res.status(403).json({
                success: false,
                error: "Sem permissão para este recurso",
            });
        }
        return next();
    };
};
exports.roleMiddleware = roleMiddleware;
