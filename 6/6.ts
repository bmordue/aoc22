import { inspect } from "util";
import { getLines } from "../aocutil";

function detectUnique(characters: string): boolean {
  return (
    [...characters].sort().filter((val, i, arr) => {
      return arr.indexOf(val) == i;
    }).length == characters.length
  );
}

function day6(line: string, window = 4) {
  let found = false;
  let count = 0;
  while (!found) {
    found = detectUnique(line.substring(count, count + window));
    count++;
  }

  console.log(`Message starts after char ${count + window - 1}`);
}

async function main() {
  const lines = await getLines();
  //  lines.forEach(day6);
  day6(lines[0], 14);
}

// 5 6 10 11

main();
