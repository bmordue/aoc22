import { PRIORITY_HIGHEST } from 'constants';
import { textSpanOverlap } from 'typescript';
import { getLines, sum } from '../aocutil';

function day2part1(lines: string[]) {
  let score = 0;

  for (let line of lines) {
    let inc = 0;
    switch (line) {
      case 'A X':
        inc = 1 + 3;
        break;
      case 'A Y':
        inc = 2 + 6;
        break;
      case 'A Z':
        inc = 3 + 0;
        break;
      case 'B X':
        inc = 1 + 0;
        break;
      case 'B Y':
        inc = 2 + 3;
        break;
      case 'B Z':
        inc = 3 + 6;
        break;
      case 'C X':
        inc = 1 + 6;
        break;
      case 'C Y':
        inc = 2 + 0;
        break;
      case 'C Z':
        inc = 3 + 3;
        break;
    }
    score += inc;
  }

  console.log(`Total score is ${score}`);
}

function charToPrio(s: string) {
  const charCode = s.charCodeAt(0);
  const lower = charCode > 96;

  return lower ? charCode - 96 : charCode - 38;
}

function part1(lines: string[]) {
  let sumPriorities = 0;

  for (let line of lines) {

    // split in half
    const left = line.substring(0, line.length / 2);
    const right = line.substring(line.length / 2);
    // console.log(`${line} : ${left} | ${right}`);

    let yup = true;
    [...left].forEach(c => {
      if (right.includes(c) && yup) {
        const prio = charToPrio(c);
        sumPriorities += prio;
        yup = false;
      }
    });

  }

  console.log(`Sum of priorities is ${sumPriorities}`);

}

function part2(lines: string[]) {
  let sum = 0;
  let done = 0;
  while (done < lines.length - 2) {
    const one = lines[done];
    const two = lines[done + 1];
    const three = lines[done + 2];
    done += 3;

    let found = false;
    [...one].forEach((c) => {
      if (two.includes(c) && three.includes(c) && !found) {
        sum += charToPrio(c);
        found = true;
      }
    });

  }
  console.log(`sum of priorities: ${sum}`);
}

async function main() {
  part2(await getLines());
}

main();
