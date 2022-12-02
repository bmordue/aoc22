import * as fs from 'fs';
import * as readline from 'readline';
import { inspect} from 'util';

async function readLines() {
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

function processLines(lines :string[]) {
  const elfTotals: number[] = [];
  let elfIndex = 0;
  elfTotals[0] = 0;
  lines.forEach((line) => {
    if (line) {
      const calories = parseInt(line);
      console.log(calories);
      elfTotals[elfIndex] += calories;
    } else {
      elfIndex++;
      elfTotals[elfIndex] = 0;
      console.log(`elf #${elfIndex}`);
      console.log(`previous total: ${elfTotals[elfIndex - 1]}`);
    }
  });
  console.log(`Highest calorie count is ${max(elfTotals)}`);
  const sorted = sortDesc(elfTotals);
  console.log(inspect(sorted));
  const topThree = sorted[0] + sorted[1] + sorted[2];
  console.log(`Sum of highest three calorie counts is ${topThree}`);
}

function sortDesc(arr: number[]) {
  return arr.sort((a, b) => b - a);
}

function max(arr: number[]) {
  return arr.reduce((a, b) => (a > b ? a : b));
}

async function main() {
  const lines = await readLines();
  processLines(lines);
}

main();
