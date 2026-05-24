"use strict";
// src/utils/safe-number.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeNumber = safeNumber;
function safeNumber(value, fallback = 0, decimals = 2) {
    const num = Number(value);
    if (Number.isNaN(num) ||
        !Number.isFinite(num)) {
        return fallback;
    }
    return Number(num.toFixed(decimals));
}
