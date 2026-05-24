"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDuqueDezena = generateDuqueDezena;
function generateDuqueDezena(dezenas) {
    const result = [];
    for (let i = 0; i < dezenas.length; i++) {
        for (let j = i + 1; j < dezenas.length; j++) {
            result.push(`${dezenas[i]} + ${dezenas[j]}`);
        }
    }
    return result;
}
