import { parse } from "path";
import { createSecureContext } from "tls";
import { getLines, sum } from "../aocutil";

async function main() {
  const lines = await getLines();
  day13(lines);
}

main();

function day13(lines: string[]) {
  let correct: number[] = [];
  let index = 0;
  let sumIndices = 0;
  while (lines.length > 0) {
    index++;
    // read a pair
    const left = lines.shift() || "";
    const right = lines.shift() || "";
    const leftList = parseList(left);
    const rightList = parseList(right);

    console.log(`${leftList} | ${rightList}`);

    // discard blank line
    lines.shift();

    //compare and record index if correctly sorted
    // if (correctlyOrdered(leftList, rightList)) {
    //   sumIndices += index;
    // }
  }
  console.log(`Sum of indices is ${sumIndices}`);
}

function parseList(line: string): any[] {
  console.log(`Try to parse: ${line}`);
  let result = [];
  line = line.substring(1, line.length);
  let tokens = line.split(',');
  for (let i = 0; i < line.length; i++) {
    let char = line[i];

    if (char == "[") {
      let j = i;
      let next;
      let openBrackets = 1;
      while (openBrackets > 0) {
        j++;
        next = line[j];
        if (next == "[") {
          openBrackets++;
        } else if (next == "]") {
          openBrackets--;
        }
      }
      const listStr = line.substring(i + 1, j);
      console.log(`listStr: ${listStr}`);
      result.push(parseList(listStr));
      i = j;
    }
  }
  return result;
}

function parseListBorked(line: string) {
  // strip brackets
  let contents = line.substring(1, line.length - 1);

  //tokenize on comma
  let tokens = contents.split(",");

  let result: any[] = [];
  while (tokens) {
    let token = tokens.shift() || "";
    if (token[0] == "[") {
      // const close = tokens.findIndex((t) => t == );

      result.push(parseList(token));
    } else {
      let num = parseInt(token);
      if (!isNaN(num)) {
        result.push(num);
      }
    }
  }

  // parse tokens
  console.log(`parsed "${line}" as "${tokens}"`);
  return result;
}
function correctlyOrdered(leftList: any[], rightList: any[]) {
  return false;
}
