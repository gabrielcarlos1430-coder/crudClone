"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGrupo = generateGrupo;
function generateGrupo(dezenas) {
    return dezenas.map((d) => {
        const dezena = parseInt(d, 10);
        const grupo = Math.floor(dezena / 4) + 1;
        return {
            dezena: d,
            grupo,
        };
    });
}
