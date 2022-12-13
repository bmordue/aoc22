import { posix } from "path";
import { start } from "repl";
import {
  addPos,
  copyPos,
  equalPos,
  getLines,
  Position,
  posStr,
  subtractPos,
} from "../aocutil";

const directions: Position[] = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

function canClimb(grid: string[], current: Position, diff: Position): boolean {
  if (
    current.x + diff.x < 0 ||
    current.x + diff.x >= grid[0].length ||
    current.y + diff.y < 0 ||
    current.y + diff.y >= grid.length
  ) {
    // console.log(
    //   `Tried to move ${posStr({ x: diff.x, y: diff.y })} from ${posStr(
    //     current
    //   )}`
    // );
    // console.log("Cannot leave the grid!");
    return false;
  }

  // console.log(`Checking height at ${posStr(diff)} from ${posStr(current)}`);

  let newHeight: string = grid[current.y + diff.y][current.x + diff.x];

  const currentHeight: string = grid[current.y][current.x];

  if (newHeight == "E") {
    // console.log(
    //   `Attempt climb to E from ${posStr(current)} (${currentHeight})`
    // );
    newHeight = "z";
  }

  if (currentHeight == "S") {
    // console.log("Leaving the Start");
    return true;
  }

  const climbable = newHeight.charCodeAt(0) <= currentHeight.charCodeAt(0) + 1;
  // console.log(
  //   `Current height: ${currentHeight}, new height ${newHeight}. ${
  //     climbable ? "Climabled!" : "Cannot climb there"
  //   }`
  // );
  return climbable;
}

// function makeMove(current: Position, diff: Position) {
//   return
// }

function arrayContains(arr: Position[], item: Position): boolean {
  let contains = false;
  for (let i = 0; i < arr.length; i++) {
    if (equalPos(arr[i], item)) {
      contains = true;
    }
  }
  return contains;
}

function pathsFrom(
  grid: string[],
  start: Position,
  end: Position,
  previousVisited: Position[],
  solutions: Position[][]
) {
  let visited = previousVisited.map(copyPos);
  visited.push(start);

  // let limit = grid.length * grid[0].length;
  // let allPaths: Position[][] = [];

  let availableMoves = findAvailableMoves(start, visited, grid);

  // let allRoutes: Position[][] = [];
  // availableMoves.forEach((move) => {

  for (let i = 0; i < availableMoves.length; i++) {
    const move = availableMoves[i];
    const newPos = addPos(start, move);
    if (equalPos(newPos, end)) {
      // visited.push(newPos);
      // console.log(`Completed route! (${visited.length} steps)`);
      // console.log(`${visited.map(posStr)}`);
      solutions.push(visited);
      // allRoutes.push(visited);
      // allPaths.push(visited);
    } else {
      // allRoutes = allRoutes.concat(pathsFrom(grid, newPos, end, visited));
      pathsFrom(grid, newPos, end, visited, solutions);
    }
  }

  // return allRoutes;

  // if (availableMoves.length == 0) {
  //   console.log(`Stuck at ${posStr(start)}`);
  //   //   iter = limit;
  // }

  // if (availableMoves.length > 0) {
  //   start = addPos(start, availableMoves[0]);
  // } else {
  //   console.log(`Stuck at ${posStr(start)}`);
  //   iter = limit;
  // }
}

function findAvailableMoves(
  curPos: Position,
  path: Position[],
  grid: string[]
) {
  let availableMoves: Position[] = [];
  let candidates = directions
    .map((dir) => {
      return addPos(curPos, dir);
    })
    .filter((candidate: Position) => !arrayContains(path, candidate)); // don't revisit squares!

  if (candidates.length > 3 && path.length > 1) {
    console.log("Failed to prune the candidates:");
    console.log(
      `candidates: ${candidates.map(posStr)}; path: ${path.map(posStr)}`
    );
  }

  for (let candidate of candidates) {
    let dir = subtractPos(candidate, curPos); // *sigh*
    if (canClimb(grid, curPos, dir)) {
      availableMoves.push(dir);
    }
  }
  return availableMoves;
}

function day12(this: any, grid: string[]) {
  const startY = grid.findIndex((row) => row.includes("S"));
  const startX = grid[startY].indexOf("S");
  const start = { x: startX, y: startY };

  const endY = grid.findIndex((row) => row.includes("E"));
  const endX = grid[endY].indexOf("E");
  const end = { x: endX, y: endY };

  console.log(`S: ${posStr(start)} E: ${posStr(end)}`);

  let solutions: Position[][] = [];
  pathsFrom(grid, start, end, [], solutions);

  console.log(`Found ${solutions.length} routes`);
  // solutions.forEach((p) => console.log(`${p.map(posStr)} (${p.length})`));

  let minSteps = solutions
    .map((p) => p.length)
    .reduce((a, b) => (a > b ? b : a));

  console.log(`Shortest route has ${minSteps} steps.`);
}

function gridAt(grid: number[][], pos: Position) {
  return grid[pos.y][pos.x];
}

function day12try2(grid: string[]) {
  const startY = grid.findIndex((row) => row.includes("S"));
  const startX = grid[startY].indexOf("S");
  const start = { x: startX, y: startY };

  const endY = grid.findIndex((row) => row.includes("E"));
  const endX = grid[endY].indexOf("E");
  const end = { x: endX, y: endY };

  console.log(`S: ${posStr(start)} E: ${posStr(end)}`);

  let minSteps = 0;

  let numGrid: number[][] = [];
  //convert grid to numbers
  for (let i = 0; i < grid.length; i++) {
    const numRow = [];
    for (let j = 0; j < grid[i].length; j++) {
      numRow.push(grid[i].charCodeAt(j));
    }
    numGrid.push(numRow);
  }

  numGrid[start.y][start.x] = 97; //"a".charCodeAt(0);
  numGrid[end.y][end.x] = "z".charCodeAt(0);

  // console.log(numGrid);

  let paths: Position[][] = [];
  let visited: Position[] = [];

  let frontier: { c: Position; p: Position[] }[] = [{ c: start, p: [] }];
  let done = false;
  while (frontier.length > 0 && !done) {
    let current = frontier.shift();
    let curPos = current?.c || { x: -1, y: -1 };
    let curPath = current?.p || [];
    let path = [...curPath];
    path.push(curPos);
    // let curPos = frontier.shift() || { x: -1, y: -1 };
    // console.log(
    //   `curPos: ${posStr(curPos)} | visited ${visited.map(
    //     posStr
    //   )} | frontier ${frontier.map(posStr)}`
    // );
    if (equalPos(curPos, end)) {
      // done = true;
      console.log(`Found a route with ${path.length - 1} steps.`);
      // console.log(`${visited.map(posStr)}`);
    }
    if (!arrayContains(visited, curPos)) {
      let currentHeight = gridAt(numGrid, curPos);
      directions.forEach((dir) => {
        let candidate = addPos(curPos, dir);
        if (
          candidate.x >= 0 &&
          candidate.x < numGrid[0].length &&
          candidate.y >= 0 &&
          candidate.y < numGrid.length
        ) {
          if (gridAt(numGrid, candidate) <= currentHeight + 1) {
            frontier.push({ c: candidate, p: path });
          }
        }
      });
      visited.push(curPos);
    }
  }

  //console.log(`Shortest route has ${minSteps} steps.`);
}

async function main() {
  const lines = await getLines();
  day12try2(lines);
}

main();
