import { inspect } from "util";
import { getLines, sum } from "../aocutil";

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
  // console.log(`Part 1 answer is ${sumIndices}`);
}
