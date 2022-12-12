import { inspect } from "util";
import { getLines } from "../aocutil";

enum OpTypeEnum {
  Mult, Add
}

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
  inspections: number = 0;

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
  // console.log(`parseOp: ${input}`);
  const myStr = input.split('=')[1];
  const tokens = myStr.split(' ');
  const opStr = tokens[2].trim();
  const opType = opStr == '+' ? OpTypeEnum.Add : OpTypeEnum.Mult;
  const argStr = tokens[3].trim();

  let theArg;
  // console.log(`argStr: ${argStr}`)
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
    // console.log(`monkey: ${inspect(monkey)}`);

    monkeys.push(monkey);
  }

  console.log(`Parsed ${monkeys.length} monkeys`);
  return monkeys;
}

function monkeyInspect(monkey: Monkey, item: number): number {
  const resolvedArg = monkey.op.arg.isOld ? item : monkey.op.arg.value || 0;
  let result = 0;
  if (monkey.op.op == OpTypeEnum.Add) {
    result = item + resolvedArg;
  } else {
    result = item * resolvedArg;
  }
  // console.log(`    Worry level is ${monkey.op.op == OpTypeEnum.Add ? "added" : "multiplied"} by ${resolvedArg} to ${result}`);
  return result;
}

function monkeyAround(monkey: Monkey, i: number, monkeys: Monkey[]) {
  // console.log(`Monkey ${monkey.id}:`);
  while (monkey.startItems.length > 0) {
    let item = monkey.startItems.shift();
    if (!item) return;
    // console.log(`  Monkey inspects an item with a worry level of ${item}`);
    //inspect;
    item = monkeyInspect(monkey, item);// % monkey.testDiv;
    monkey.inspections++;
    //div by 3;
    // item = Math.floor(item / 3); // Part 2: skip this step!
    item = item % partTwoFactor;
    // console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${item}`);

    //test
    if (item % monkey.testDiv == 0) {
      // console.log(`    Current worry level is divisible by ${monkey.testDiv}`);
      // console.log(`    Item with worry level ${item} is thrown to monkey ${monkey.trueDest}`);
      monkeys[monkey.trueDest].startItems.push(item);
    } else {
      monkeys[monkey.falseDest].startItems.push(item);
      // console.log(`    Current worry level is not divisible by ${monkey.testDiv}`);
      // console.log(`    Item with worry level ${item} is thrown to monkey ${monkey.falseDest}`);
    }
  };
}

let partTwoFactor = 2;

function day10(lines: string[]) {
  const monkeys: Monkey[] = parseMonkeys(lines);
  partTwoFactor = monkeys.map((m) => m.testDiv).reduce((a, b) => a * b);

  const rounds = 10000;//10000; // part 1: rounds = 20, part 2: rounds = 10000
  for (let i = 0; i < rounds; i++) {
    monkeys.forEach(monkeyAround);
    // console.log(`${i + 1}: ${monkeys.map((m) => m.inspections)}`);
  }

  monkeys.sort((a, b) => b.inspections - a.inspections);
  const first = monkeys[0].inspections;
  const second = monkeys[1].inspections;
  console.log(`${monkeys.map((m) => m.inspections)}`);
  console.log(`Most active two: ${first}, ${second}; product is ${first * second}`);
}

async function main() {
  const lines = await getLines();
  day10(lines);
}

main();

