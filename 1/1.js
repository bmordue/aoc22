"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const fs = require("fs");
const readline = require("readline");
const util = require("util");
const lines = [];
function readLines() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const fileStream = fs.createReadStream("input.txt");
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        try {
            // Note: we use the crlfDelay option to recognize all instances of CR LF
            // ('\r\n') in input.txt as a single line break.
            for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), _a = rl_1_1.done, !_a;) {
                _c = rl_1_1.value;
                _d = false;
                try {
                    const line = _c;
                    lines.push(line);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = rl_1.return)) yield _b.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log(`read ${lines.length} lines`);
    });
}
function processLines() {
    const elfTotals = [];
    let elfIndex = 0;
    elfTotals[0] = 0;
    lines.forEach((line) => {
        if (line) {
            const calories = parseInt(line);
            console.log(calories);
            elfTotals[elfIndex] += calories;
        }
        else {
            elfIndex++;
            elfTotals[elfIndex] = 0;
            console.log(`elf #${elfIndex}`);
            console.log(`previous total: ${elfTotals[elfIndex - 1]}`);
        }
    });
    console.log(`Highest calorie count is ${max(elfTotals)}`);
    const sorted = sortDesc(elfTotals);
    console.log(util.inspect(sorted));
    const topThree = sorted[0] + sorted[1] + sorted[2];
    console.log(`Sum of highest three calorie counts is ${topThree}`);
}
function sortDesc(arr) {
    return arr.sort((a, b) => b - a);
}
function max(arr) {
    return arr.reduce((a, b) => (a > b ? a : b));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield readLines();
        processLines();
    });
}
main();
