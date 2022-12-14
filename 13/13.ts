import { inspect } from "util";
import { getLines, sum } from "../aocutil";

interface TreeNode {
  parent: TreeNode | null;
  children: TreeNode[];
}

async function main() {
  const lines = await getLines();
  day13(lines);
}

main();

function day13(lines: string[]) {
  let correct: number[] = [];
  let index = 0;
  let sumIndices = 0;
  while (lines.length > 0) {
    index++;
    // read a pair
    const left = lines.shift() || "";
    const right = lines.shift() || "";
    // const leftList = parseList(left);
    // const rightList = parseList(right);

    const allTokensL: any[] | undefined = [];
    const allTokensR: any[] | undefined = [];
    const leftTree = tokenise(left, allTokensL);
    const rightTree = tokenise(right, allTokensR);

    console.log(`${inspect(allTokensL)} | ${inspect(allTokensR)}`);

    // discard blank line
    lines.shift();

    //compare and record index if correctly sorted
    // if (correctlyOrdered(leftList, rightList)) {
    //   sumIndices += index;
    // }
  }
  console.log(`Sum of indices is ${sumIndices}`);
}

function buildTree(root: TreeNode, line: string): TreeNode {
  //   console.log(`Try to parse: ${line}`);
  let tree: TreeNode = { parent: root, children: [] };
  line = line.substring(1, line.length); // line will always be a list

  //   for (let i = 0; i < line.length; i++) {
  //     let char = line[i];

  //     if (char == "[") {
  //       let j = i;
  //       let next;
  //       let openBrackets = 1;
  //       while (openBrackets > 0) {
  //         j++;
  //         next = line[j];
  //         if (next == "[") {
  //           openBrackets++;
  //         } else if (next == "]") {
  //           openBrackets--;
  //         }
  //       }
  //       const listStr = line.substring(i + 1, j);
  //       //   console.log(`listStr: ${listStr}`);
  //       tree.children.push(buildTree(tree, listStr));
  //       i = j;
  //     } else if (char == ",") {
  //       let j = i;
  //       let next;
  //       while (next != ",") {
  //         j++;
  //         next = line[j];
  //       }
  //       tree.children.push;
  //       i = j;
  //     }
  //   }
  return tree;
}

function tokenise(line: string, allTokens: any[] = []) {
  // line will always be a list, skip outermost brackets
  let tokens: any[] = [];
  let openBrackets = 0;
  let currentToken = "";
  for (let i = 1; i < line.length - 1; i++) {
    if (line[i] == "[") {
      openBrackets++;
    } else if (line[i] == "," && currentToken != "" && openBrackets == 0) {
      tokens.push(currentToken);
      currentToken = "";
    } else if (line[i] == "]") {
      openBrackets--;
      if (openBrackets == 0) {
        tokens.push(tokenise(currentToken));
      }
    } else {
      currentToken += line[i];
    }
  }
  allTokens.push(tokens);
}

function correctlyOrdered(leftList: any[], rightList: any[]) {
  return false;
}
