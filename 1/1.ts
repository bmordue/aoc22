import * as fs from 'fs';
import * as readline from 'readline';
import { inspect} from 'util';
import { getLines, max, sortDesc } from '../aocutil';

function processLines(lines :string[]) {
  const elfTotals: number[] = [];
  let elfIndex = 0;
  elfTotals[0] = 0;
  lines.forEach((line) => {
    if (line) {
      const calories = parseInt(line);
      // console.log(calories);
      elfTotals[elfIndex] += calories;
    } else {
      elfIndex++;
      elfTotals[elfIndex] = 0;
      // console.log(`elf #${elfIndex}`);
      // console.log(`previous total: ${elfTotals[elfIndex - 1]}`);
    }
  });
  console.log(`Highest calorie count is ${max(elfTotals)}`);
  const sorted = sortDesc(elfTotals);
  console.log(inspect(sorted));
  const topThree = sorted[0] + sorted[1] + sorted[2];
  console.log(`Sum of highest three calorie counts is ${topThree}`);
}

async function main() {
  const lines = await getLines();
  processLines(lines);
}

main();
