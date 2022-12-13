import fs from "fs";
import readline from "readline";

export interface Position {
  x: number;
  y: number;
}

export function copyPos(pos: Position) {
  return { x: pos.x, y: pos.y };
}

export function equalPos(a: Position, b: Position) {
  return a.x == b.x && a.y == b.y;
}

export function addPos(a: Position, b: Position): Position {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtractPos(a: Position, b: Position): Position {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function posStr(value: Position) {
  return `(${value.x},${value.y})`;
}

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
  return arr.reduce((a, b) => a + b);
}

export function sortDesc(arr: number[]) {
  return arr.sort((a, b) => b - a);
}

export function max(arr: number[]) {
  return arr.reduce((a, b) => (a > b ? a : b));
}

export function unique(
  value: Position,
  index: number,
  array: Position[]
): boolean {
  return (
    array.findIndex((n: Position) => {
      return n.x == value.x && n.y == value.y;
    }) == index
  );
}

export function tail(arr: Array<any>) {
  return arr[arr.length - 1];
}
