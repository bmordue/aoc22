const fs = require("fs");
const readline = require("readline");
const util = require("util");

const lines: string[] = [];

async function readLines() {
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
}

function processLines() {
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
  console.log(util.inspect(sorted));
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
  await readLines();
  processLines();
}

main();
