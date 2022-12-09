import { dir } from "console";
import { getLines } from "../aocutil";

interface Position {
  x: number;
  y: number;
}

function unique(value: Position, index: number, array: Position[]): boolean {
  return (
    array.findIndex((n: Position) => {
      return n.x == value.x && n.y == value.y;
    }) == index
  );
}

function moveHead(start: Position, direction: string): Position {
  let end: Position = start;
  switch (direction) {
    case "L":
      end = { x: start.x - 1, y: start.y };
      break;
    case "R":
      end = { x: start.x + 1, y: start.y };
      break;
    case "U":
      end = { x: start.x, y: start.y - 1 };
      break;
    case "D":
      end = { x: start.x, y: start.y + 1 };
      break;
  }
  return end;
}

function copyPos(pos: Position) {
  return { x: pos.x, y: pos.y };
}

function moveTail(start: Position, head: Position) {
  let end = copyPos(start);

  // [2,2]: something has gone wrong!
  const moves = [
    [
      [2, 2],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [2, 2],
    ],
    [
      [-1, -1],
      [0, 0],
      [0, 0],
      [0, 0],
      [-1, 1],
    ],
    [
      [0, -1],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 1],
    ],
    [
      [1, -1],
      [0, 0],
      [0, 0],
      [0, 0],
      [1, 1],
    ],
    [
      [2, 2],
      [1, -1],
      [1, 0],
      [1, 1],
      [2, 2],
    ],
  ];

  const diffX = head.x - start.x + 2; // +2 to get index in moves array
  const diffY = head.y - start.y + 2;

  end.x += moves[diffX][diffY][0];
  end.y += moves[diffX][diffY][1];
  return end;
}

function printPath(positions: Position[]) {
  let rows: string[] = [];
  for (let i = 0; i < 10; i++) {
    rows[i] = "";
    for (let j = 0; j < 10; j++) {
      if (positions.find((p) => p.x == j && p.y == -1 * i)) {
        rows[i] += "#";
      } else {
        rows[i] += ".";
      }
    }
  }
  while (rows.length) {
    console.log(rows.pop());
  }
}

function posStr(value: Position) {
  return ` (${value.x},${value.y})`;
}

function day9(lines: string[]) {
  let H: Position = { x: 0, y: 0 };
  let T: Position = { x: 0, y: 0 };
  let visited: Position[] = [T];
  let headVisits: Position[] = [H];

  lines.forEach((line) => {
    const direction = line.split(" ")[0];
    const steps = parseInt(line.split(" ")[1]);

    for (let i = 0; i < steps; i++) {
      H = moveHead(H, direction);
      T = moveTail(T, H);
      visited.push(T);
      headVisits.push(H);
    }
  });

  // console.log(`Path traced by tail: ${visited.map(posStr)}`);
  // console.log(`Path traced by head: ${headVisits.map(posStr)}`);
  const dedup = visited.filter(unique);
  // printPath(dedup);
  // console.log(`Deduplicated position visited by tail: ${dedup.map(posStr)}`);
  console.log(`Part 1: number of positions visited is ${dedup.length}`);
  // printPath(headVisits.filter(unique));
}

async function main() {
  day9(await getLines());
}

main();
