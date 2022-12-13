import { getLines, Position, unique, copyPos, tail } from "../aocutil";



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

function moveTail(start: Position, head: Position) {
  let end = copyPos(start);

  const moves = [
    [
      [-1, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [-1, 1],
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
      [1, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [1, 1],
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



function day9(lines: string[]) {
  const ropeSize = 10; // ropeSize = 2 for part 1; 10 for part 2
  let rope: Position[] = new Array(ropeSize).fill({ x: 0, y: 0 });

  let visited: Position[] = [tail(rope)];

  lines.forEach((line) => {
    const direction = line.split(" ")[0];
    const steps = parseInt(line.split(" ")[1]);

    for (let i = 0; i < steps; i++) {
      rope[0] = moveHead(rope[0], direction);
      for (let knot = 1; knot < ropeSize; knot++) {
        rope[knot] = moveTail(rope[knot], rope[knot - 1]); //, rope, knot);
      }
      visited.push(tail(rope));
    }
  });

  console.log(
    `Number of positions visited is ${visited.filter(unique).length}`
  );
}

async function main() {
  day9(await getLines());
}

main();
