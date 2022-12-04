import { getLines } from '../aocutil';

function encloses(leftMin: number, leftMax: number, rightMin: number, rightMax: number) {
  return ((leftMin <= rightMin && leftMax >= rightMax) || (leftMin >= rightMin && leftMax <= rightMax))
}

function overlapping(leftMin: number, leftMax: number, rightMin: number, rightMax: number) {
  return (leftMin >= rightMin && leftMin <= rightMax) || (leftMax >= rightMin && leftMax <= rightMax)
}

function part1(lines: string[]) {
  let overlaps = 0;

  for (let line of lines) {
    let left = line.split(',')[0];
    let right = line.split(',')[1];
    let leftMin = parseInt(left.split('-')[0]);
    let leftMax = parseInt(left.split('-')[1]);
    let rightMin = parseInt(right.split('-')[0]);
    let rightMax = parseInt(right.split('-')[1]);

    if (encloses(leftMin, leftMax, rightMin, rightMax)) {
      overlaps++;
    }
  }

  console.log(`Count of overlaps is ${overlaps}`);

}

function part2(lines: string[]) {
  let overlaps = 0;

  for (let line of lines) {
    let left = line.split(',')[0];
    let right = line.split(',')[1];
    let leftMin = parseInt(left.split('-')[0]);
    let leftMax = parseInt(left.split('-')[1]);
    let rightMin = parseInt(right.split('-')[0]);
    let rightMax = parseInt(right.split('-')[1]);

    if (overlapping(leftMin, leftMax, rightMin, rightMax) || encloses(leftMin, leftMax, rightMin, rightMax)) {
      overlaps++;
    }
    // console.log(`${line}: [${overlaps}]`);
  }

  console.log(`Count of overlaps is ${overlaps}`);

}


async function main() {
  part2(await getLines());
}

main();
