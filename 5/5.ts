import { inspect } from "util";
import { getLines } from "../aocutil";

function parseInitialState(lines: string[]) {
  // console.log(lines);
  let line = lines[0];
  let startLines: string[] = [];
  while (line != "") {
    line = lines.shift() || "";
    // console.log(line);
    startLines.push(line);
  }
  startLines.pop(); //get rid of the empty line

  // console.log(`startLines: ${startLines}`);
  const headings = startLines.pop() || "";
  const numStacks = (headings.length + 1) / 4;
  // console.log(`Number of stacks: ${numStacks}`);
  let listOfStacks = new Array(numStacks);
  for (let i = 0; i < numStacks; i++) {
    listOfStacks[i] = [];
  }

  for (let row of startLines.reverse()) {
    // console.log(`line ${row}`);
    for (let i = 0; i < numStacks; i++) {
      const crateStr = row.substring(i * 4, i * 4 + 3);
      if (crateStr != "   ") {
        listOfStacks[i].push(crateStr);
      }
      // console.log(`Pushed ${crateStr} onto stack ${i}`);
    }
  }

  // printState(listOfStacks);

  return { state: listOfStacks, instructions: lines };
}

function moveCrates(
  state: string[][],
  quantity: number,
  from: number,
  to: number
) {
  // console.log(`moveCrates: move ${quantity} from ${from} to ${to}\nBefore:`);
  // printState(state);

  while (quantity > 0) {
    const crate = state[from - 1].pop();
    if (crate) {
      state[to - 1].push(crate);
    }
    quantity--;
  }

  // console.log("After:");
  // printState(state);
}

function printState(state: string[][]) {
  console.log("-------");
  let max = 0;
  for (let stack of state) {
    if (stack.length > max) {
      max = stack.length;
    }
  }
  let rows = [];
  for (let i = 0; i < max; i++) {
    let row = "";
    for (let stack of state) {
      if (i < stack.length) {
        row += stack[i];
      } else {
        row += "   ";
      }
    }
    rows.push(row);
  }
  for (let i = 0; i < max; i++) {
    console.log(rows[rows.length - i - 1]);
  }
  console.log("-------");
}

function peek(arr: Array<any>) {
  return arr[arr.length - 1];
}

function part1(lines: string[]) {
  const input = parseInitialState(lines);
  const state: string[][] = input.state;
  // console.log(inspect(state));

  for (let line of input.instructions) {
    //move 1 from 1 to 2
    const re = /move (\d*) from (\d*) to (\d*)/;
    const tokens = line.match(re);
    if (tokens) {
      moveCrates(
        state,
        parseInt(tokens[1]),
        parseInt(tokens[2]),
        parseInt(tokens[3])
      );
    }
  }
  //  console.log(inspect(state));

  for (let stack of state) {
    console.log(peek(stack));
  }
}



function part2(lines: string[]) {}

async function main() {
  part1(await getLines());
}

main();
