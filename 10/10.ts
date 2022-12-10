import { inspect } from "util";
import { getLines } from "../aocutil";

function detectUnique(characters: string): boolean {
  return (
    [...characters].sort().filter((val, i, arr) => {
      return arr.indexOf(val) == i;
    }).length == characters.length
  );
}

function tail(arr: Array<any>) {
  return arr[arr.length - 1];
}

function day6(lines: string[]) {
  let regX: number[] = [1];
  lines.forEach((line) => {
    const inst = line.split(' ')[0];
    const arg = line.split(' ')[1];

    if (inst == 'noop') {
      regX.push(tail(regX));
    } else if (inst == 'addx') {
      regX.push(tail(regX));
      regX.push(tail(regX) + parseInt(arg));
    }
  });

  console.log(`regX[220] : ${regX[220]}`);
  // 20th, 60th, 100th, 140th, 180th, and 220th
  const strengths = [20, 60, 100, 140, 180, 220].map((i) => regX[i - 1] * i);
  console.log(`strengths: ${strengths}`);
  console.log(`Sum of six signal strengths ${strengths.reduce(sum)}`);
}

function sum(a: number, b: number) {
  return a + b;
}

async function main() {
  const lines = await getLines();
  day6(lines);
}

main();
