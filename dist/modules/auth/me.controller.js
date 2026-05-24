"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
const me_service_1 = require("./me.service");
async function me(req, res) {
    try {
        const userId = req.user.id;
        const user = await (0, me_service_1.getMeService)(userId);
        return res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            error: 'Erro ao buscar perfil',
        });
    }
}
