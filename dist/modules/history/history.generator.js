"use strict";
// src/modules/history/history.generator.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryGenerator = void 0;
// ==========================================
// 🎲 HISTORY GENERATOR
// ==========================================
class HistoryGenerator {
    // ==========================================
    // 🔥 GERA NÚMERO
    // ==========================================
    static randomNumber() {
        return Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
    }
    // ==========================================
    // 🕒 DATA ALEATÓRIA
    // ==========================================
    static randomDate(start, end) {
        return new Date(start.getTime() +
            Math.random() *
                (end.getTime() -
                    start.getTime()));
    }
    // ==========================================
    // 🧠 GERA HISTÓRICO
    // ==========================================
    static generate(quantity = 10000) {
        const draws = [];
        const hotNumbers = [
            '1234',
            '5678',
            '9999',
            '1111',
            '2222'
        ];
        for (let i = 0; i < quantity; i++) {
            let number;
            // 🔥 20% chance de número quente
            if (Math.random() < 0.2) {
                number =
                    hotNumbers[Math.floor(Math.random() *
                        hotNumbers.length)];
            }
            else {
                number =
                    this.randomNumber();
            }
            draws.push({
                number,
                extractedAt: this.randomDate(new Date(2025, 0, 1), new Date()),
                source: [
                    'PTM',
                    'PT',
                    'LOOK',
                    'NACIONAL'
                ][Math.floor(Math.random() * 4)]
            });
        }
        return draws.sort((a, b) => a.extractedAt.getTime() -
            b.extractedAt.getTime());
    }
}
exports.HistoryGenerator = HistoryGenerator;
