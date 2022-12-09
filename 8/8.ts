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

function part1(grid: number[][]) {
  const lineLen = grid[0].length;

  let visibleTrees: string[][] = [];
  // count visible trees
  let count = 2 * grid.length + 2 * grid[0].length - 4;
  for (let i = 1; i < grid.length - 1; i++) {
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

function scoreFor(sequence: number[], height: number) {
  console.log(`score for ${sequence}, ${height}`);
  let score = 1;
  let i = 0;
  while (sequence.length > 0) {
    let nextTree = sequence.shift() || 0;
    if (nextTree < height) {
      score++;
    } else {
      return score;
    }
  }
  console.log(`score : ${score}`);
  return score;
}

function scoreTree(grid: number[][], i: number, j: number): number[] {
  if (i == 0 || j == 0 || i == grid[0].length - 1 || j == grid.length - 1) {
    return [0, 0, 0, 0];
  }
  // up down left right
  let treeScores: number[] = [0, 0, 0, 0];
  const height = grid[i][j];

  // const col = grid.map((r) => r[j]);
  // scores[0] = scoreFor(col.slice(0, j).reverse(), height); // up
  // scores[1] = scoreFor(col.slice(j + 1), height); // down
  // scores[2] = scoreFor(grid[i].slice(0, i).reverse(), height); // left
  // scores[3] = scoreFor(grid[i].slice(i + 1), height); // right
  // return scores;

  let blocked = false;
  let k = j; // - 1;
  while (!blocked && k > 0) {
    treeScores[0]++;
    k--;
    if (grid[i][k] >= height) {
      blocked = true;
    }
  }
  // treeScores[0] = j - k;

  blocked = false;
  k = j; // + 1;
  while (!blocked && k < grid[i].length - 1) {
    treeScores[1]++;
    k++;
    if (grid[i][k] >= height) {
      blocked = true;
    }
  }
  // treeScores[1] = k - j;

  k = i; // - 1;
  blocked = false;
  while (!blocked && k > 0) {
    treeScores[2]++;
    k--;
    if (grid[k][j] >= height) {
      blocked = true;
    }
  }
  // treeScores[2] = i - k;

  k = i; // + 1;
  blocked = false;
  while (!blocked && k < grid.length - 1) {
    treeScores[3]++;
    k++;
    if (grid[k][j] >= height) {
      blocked = true;
    }
  }
  // treeScores[3] = k - i;

  return treeScores; //.reduce((a, b) => a * b);
}

function part2(grid: number[][]) {
  const lineLen = grid[0].length;

  let scores: string[][] = []; // don't need to build this, but handy for debugging
  let maxScore = 0;

  for (let i = 0; i < grid.length; i++) {
    scores[i] = [];
    for (let j = 0; j < lineLen; j++) {
      const score = scoreTree(grid, i, j).reduce((a, b) => a * b);
      maxScore = score > maxScore ? score : maxScore;
      scores[i].push(score.toString());
    }
  }
  console.log(scores);
  console.log(`Max tree score is ${maxScore}`);
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
  // part1(grid);

  part2(grid);
}

async function main() {
  day7(await getLines());
}

main();
