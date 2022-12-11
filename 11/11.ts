import { match } from "assert";
import { parse } from "path/posix";
import { OperationCanceledException } from "typescript";
import { inspect } from "util";
import { getLines } from "../aocutil";

enum OpTypeEnum {
  Mult, Add
}

// interface Item {
//   id: number
// }

interface OperationArg {
  isOld: boolean,
  value?: number
}

interface Operation {
  op: OpTypeEnum,
  arg: OperationArg
}

class Monkey {
  id: number;
  startItems: number[];
  op: Operation;
  testDiv: number;
  trueDest: number; // monkey id
  falseDest: number; // monkey id

  constructor(id: number, startItems: number[], op: Operation, testDiv: number, trueDest: number, falseDest: number) {
    this.id = id;
    this.startItems = startItems;
    this.op = op;
    this.testDiv = testDiv;
    this.trueDest = trueDest;
    this.falseDest = falseDest;
  }

}

// Operation: new = old * 19
// Operation: new = old * old
function parseOperation(input: string) {
  console.log(`parseOp: ${input}`);
  const myStr = input.split('=')[1];
  const tokens = myStr.split(' ');
  const opStr = tokens[2].trim();
  const opType = opStr == '+' ? OpTypeEnum.Add : OpTypeEnum.Mult;
  const argStr = tokens[3].trim();

  let theArg;
  console.log(`argStr: ${argStr}`)
  if (argStr == 'old') {
    theArg = { isOld: true }
  } else {
    const val = parseInt(argStr);
    theArg = { isOld: false, value: val }
  }

  const op: Operation = {
    op: opType, arg: theArg
  };

  return op;
}

function parseMonkeys(lines: string[]) {
  let monkeys: Monkey[] = [];

  while (lines.length > 0) {
    let line = lines.shift(); //monkey number
    let id = -1;
    let matches = line?.match(/\d+/);
    if (matches) {
      // console.log(`Monkey ID line: "${line}"`);
      // console.log(`Monkey ID: trying parseInt on: "${matches[0]}"`);
      id = parseInt(matches[0]);
    }
    line = lines.shift(); // starting items
    const re = /(\d+)/g;
    matches = line?.match(re);
    //    const items = matches?.map(parseInt) || [];
    let items: number[] = [];
    if (matches) {
      items = matches.map((m) => {
        // console.log(`parseInt with ${m}`);
        return parseInt(m);
      });
      // console.log(`items matches: ${matches}; items ${items}:`);
    }

    line = lines.shift(); // operation and argument
    let operation: Operation = { op: OpTypeEnum.Add, arg: { isOld: false, value: 0 } };
    if (line) {
      operation = parseOperation(line);
    } else {
      console.log("ruh roh");
    }

    line = lines.shift();
    matches = line?.match(/\d+/);
    const first = matches ? matches[0] : '-1';
    // console.log(`trying parseInt on: ${first}`)
    const divBy = matches ? parseInt(matches[0]) : -1;

    line = lines.shift();
    matches = line?.match(/\d+/);
    const trueDest = matches ? parseInt(matches[0]) : -1;

    line = lines.shift();
    matches = line?.match(/\d+/);
    const falseDest = matches ? parseInt(matches[0]) : -1;

    line = lines.shift(); // blank line
    // console.log(`should be empty: "${line}"`);

    const monkey = new Monkey(id, items, operation, divBy, trueDest, falseDest);
    console.log(`monkey: ${inspect(monkey)}`);

    monkeys.push(monkey);
  }

  return monkeys;
}

function day10(lines: string[]) {
  const monkeys: Monkey[] = parseMonkeys(lines);

  // console.log(inspect(monkeys));
}

async function main() {
  const lines = await getLines();
  day10(lines);
}

main();

