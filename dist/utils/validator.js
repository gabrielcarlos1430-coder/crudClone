"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAmount = validateAmount;
function validateAmount(amount) {
    if (amount <= 0 || amount > 1000) {
        throw new Error("Quantidade inválida");
    }
}
