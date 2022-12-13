import { dir } from "console";
import { start } from "repl";
import { arrayBuffer } from "stream/consumers";
import { inspect } from "util";
import {
  addPos,
  equalPos,
  getLines,
  Position,
  posStr,
  subtractPos,
  tail,
} from "../aocutil";

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

  const newHeight: string = grid[current.y + diff.y][current.x + diff.x];

  if (newHeight == "E") {
    console.log("Reached the End!");
    return true;
  }

  const currentHeight: string = grid[current.y][current.x];

  if (currentHeight == "S") {
    console.log("Leaving the Start");
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

function day12(this: any, grid: string[]) {
  const startY = grid.findIndex((row) => row.includes("S"));
  const startX = grid[startY].indexOf("S");
  const start = { x: startX, y: startY };

  const endY = grid.findIndex((row) => row.includes("E"));
  const endX = grid[endY].indexOf("E");
  const end = { x: endX, y: endY };

  console.log(`S: ${posStr(start)} E: ${posStr(end)}`);

  let curPos = start;

  let iter = 0;
  let limit = grid.length * grid[0].length;
  let path: Position[] = [];

  while (!equalPos(curPos, end) && iter < limit) {
    iter++;
    path.push(curPos);
    const directions: Position[] = [
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: -1, y: 0 },
    ];
    // const climbable = canClimb.bind(this, grid, curPos);
    // let availableMoves: Position[] = directions.filter(climbable);
    let availableMoves = [];

    let candidates = directions
      .map((dir) => {
        return addPos(curPos, dir);
      })
      .filter((candidate: Position) => !arrayContains(path, candidate)); // don't revisit squares!

    // if (path.length > 1) {
    // candidates =
    // }
    // candidates = candidates
    // for (let dir of directions) {
    //   if (canClimb(grid, curPos, dir)) {
    //     availableMoves.push(dir);
    //   }
    // }
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

    if (availableMoves.length > 0) {
      curPos = addPos(curPos, availableMoves[0]);
    } else {
      console.log(`Stuck at ${posStr(curPos)}`);
      iter = limit;
    }
    // if (canClimb(grid, curPos, 0, 1)) {
    //   console.log(`Move right from ${posStr(curPos)}`);
    //   curPos = { x: curPos.x, y: curPos.y + 1 };
    // } else if (canClimb(grid, curPos, 1, 0)) {
    //   console.log(`Move up from ${posStr(curPos)}`);
    //   curPos = { x: curPos.x + 1, y: curPos.y };
    // } else if (canClimb(grid, curPos, 0, -1)) {
    //   console.log(`Move left from ${posStr(curPos)}`);
    //   curPos = { x: curPos.x, y: curPos.y - 1 };
    // } else if (canClimb(grid, curPos, -1, 0)) {
    //   console.log(`Move down from ${posStr(curPos)}`);
    //   curPos = { x: curPos.x - 1, y: curPos.y };
    // }
  }

  let minSteps = path.length;
  console.log(`Path taken: ${path.map(posStr)}`);
  console.log(`Shortest route has ${minSteps} steps.`);
}

async function main() {
  const lines = await getLines();
  day12(lines);
}

main();
