import fs from "fs";
import readline from "readline";

export async function getLines() {
    let lines = [];
    const fileStream = fs.createReadStream("input.txt");

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        lines.push(line);
    }
    console.log(`read ${lines.length} lines`);
    return lines;
}

export function sum(arr: number[]) {
    return arr.reduce((a,b) => a + b);
}

export function sortDesc(arr: number[]) {
    return arr.sort((a, b) => b - a);
}

export function max(arr: number[]) {
    return arr.reduce((a, b) => (a > b ? a : b));
}
