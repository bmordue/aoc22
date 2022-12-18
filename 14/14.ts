import { dividePos, equalPos, getLines, magnitudePos, Position, subtractPos, posStr, addPos } from "../aocutil";

interface TreeNode {
  parent: TreeNode | null;
  children: TreeNode[];
}

async function main() {
  const lines = await getLines();
  day14(lines);
}

main();

function day14(lines: string[]) {

  // parse points
  let points: Position[][] = [];
  lines.forEach((line) => {
    let linePoints: Position[] = line.split(' -> ').map(parsePos);
    points.push(linePoints);
    // console.log(`${linePoints.map(posStr)}`);
  });

  // find grid size
  let max = { x: 0, y: 0 };
  points.forEach((row) => {
    row.forEach((point) => {
      if (point.x > max.x) max.x = point.x;
      if (point.y > max.y) max.y = point.y;
    });
  });

  // create grid
  let grid: string[][] = new Array(max.y + 1);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(max.x + 1).fill('.');
  }

  console.log(`grid[9][494]: ${grid[9][494]}`)

  console.log(`grid size: ${posStr(max)}`);

  // "draw" rocks
  points.forEach((row) => {
    const curPos = points[0];
    for (let i = 1; i < row.length; i++) {
      line(grid, row[i - 1], row[i]);
    }
  });

  printGrid(grid);

  // mark sand entry
  grid[0][500] = '+';

  // simulate falling sand
  let done = false;
  let grains = 0;
  while (!done) {//&& grains <= 22) {
    done = addSand(grid);
    grains++;
    // if (grains > 20) {
    //   console.log(`\ngrains simulated: ${grains} (done: ${done})`);
    //   printGrid(grid);
    // }
  }

  console.log(`${grains - 1} grains came to rest.`);
}

function sandBlocked(grid: string[][], at: Position) {
  // console.log(`Blocked at ${posStr(at)}? (grid.length: ${grid.length})`);
  const what = grid[at.y][at.x];
  return (what == '#' || what == 'o');
}

function addSand(grid: string[][], grain: number = 0): boolean {
  const entry = { x: 500, y: 0 };

  let resting = false;
  let sandPos = entry;
  while (!resting) {
    // console.log('+');
    grid[sandPos.y][sandPos.x] = '~';
    if (sandPos.y >= grid.length - 1 || sandPos.x < 0 || sandPos.x > grid[0].length - 1) {
      // falling out of grid
      return true; // sim is done
    }
    else if (!sandBlocked(grid, { x: sandPos.x, y: sandPos.y + 1 })) {
      // DOWN is free
      sandPos = { x: sandPos.x, y: sandPos.y + 1 };
    } else if (!sandBlocked(grid, { x: sandPos.x - 1, y: sandPos.y + 1 })) {
      // DOWN-LEFT is free
      sandPos = { x: sandPos.x - 1, y: sandPos.y + 1 };
    } else if (!sandBlocked(grid, { x: sandPos.x + 1, y: sandPos.y + 1 })) {
      // DOWN-RIGHT is free
      sandPos = { x: sandPos.x + 1, y: sandPos.y + 1 };
    } else {
      // sand coming to rest
      resting = true;
      grid[sandPos.y][sandPos.x] = 'o';
    }
  }
  return false; // sim is not done
}

function printGrid(grid: string[][]) {
  console.log('Grid:\n-----');
  grid.forEach((row) => {
    console.log(row.slice(494).join(''));
  });
}


function line(grid: string[][], start: Position, end: Position) {
  const diff = subtractPos(end, start);
  const unitVector = dividePos(diff, magnitudePos(diff));
  let current = start;
  grid[current.y][current.x] = '#';

  while (!equalPos(current, end)) {
    current = addPos(current, unitVector);
    grid[current.y][current.x] = '#';
    // console.log(`set ${posStr(current)} to #`)
  }
}

function parsePos(posStr: string): Position {
  let tokens = posStr.split(',');
  return { x: parseInt(tokens[0]), y: parseInt(tokens[1]) };
}
