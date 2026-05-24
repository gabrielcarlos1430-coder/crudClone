"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInversaoMilhar = generateInversaoMilhar;
function generateInversaoMilhar(milhar) {
    const result = new Set();
    milhar.forEach((num) => {
        const variations = permute(num);
        variations.forEach((v) => result.add(v));
    });
    return Array.from(result);
}
function permute(str) {
    if (str.length <= 1)
        return [str];
    const result = [];
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const rest = str.slice(0, i) + str.slice(i + 1);
        const perms = permute(rest);
        perms.forEach((p) => {
            result.push(char + p);
        });
    }
    return result;
}
