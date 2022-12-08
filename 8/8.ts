import { getLines } from "../aocutil";

function isVisible(grid: number[][], i: number, j: number): boolean {
  let visLeft = true;
  let visRight = true;
  let visUp = true;
  let visDown = true;
  const height = grid[i][j];
  for (let k = 0; k < j; k++) {
    if (grid[i][k] >= height) {
      visLeft = false;
    }
  }
  for (let k = j + 1; k < grid[i].length; k++) {
    if (grid[i][k] >= height) {
      visRight = false;
    }
  }

  for (let k = 0; k < i; k++) {
    if (grid[k][j] >= height) {
      visUp = false;
    }
  }
  for (let k = i + 1; k < grid.length; k++) {
    if (grid[k][j] >= height) {
      visDown = false;
    }
  }

  return visLeft || visRight || visUp || visDown;
}

function day7(lines: string[]) {
  // parse input
  let grid: number[][] = [];
  const lineLen = lines[0].length;
  for (let i = 0; i < lines.length; i++) {
    grid[i] = [];
    for (let j = 0; j < lineLen; j++) {
      grid[i].push(parseInt(lines[i][j]));
    }
  }

  // console.log(grid);

  let visibleTrees: string[][] = []; // don't need to build this, but handy for debugging
  // count visible trees
  let count = 2 * lines.length + 2 * lines[0].length - 4;
  for (let i = 1; i < lines.length - 1; i++) {
    visibleTrees[i] = [];
    for (let j = 1; j < lineLen - 1; j++) {
      if (isVisible(grid, i, j)) {
        count++;
        visibleTrees[i].push("X");
      } else {
        visibleTrees[i].push(".");
      }
    }
  }
  // console.log(visibleTrees);
  console.log(`Number of visible trees is ${count}`);
}

async function main() {
  day7(await getLines());
}

main();
