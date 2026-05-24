"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const history_generator_1 = require("./history.generator");
const history = history_generator_1.HistoryGenerator.generate(20);
console.log(history);
