import { inspect } from "util";
import { getLines, sum } from "../aocutil";

interface TreeNode {
  value: string;
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

    let leftTree: TreeNode = { parent: null, children: [], value: left };
    let rightTree: TreeNode = { parent: null, children: [], value: right };

    leftTree = tokenise(left, leftTree);
    rightTree = tokenise(right, rightTree);
    // console.log(`${inspect(leftTree)} | ${inspect(rightTree)}`);

    // discard blank line
    lines.shift();

    // compare and record index if correctly sorted
    if (correctlyOrdered(leftTree, rightTree)) {
      sumIndices += index;
    }
  }
  console.log(`Sum of indices is ${sumIndices}`);
}

function tokenise(line: string, parent: TreeNode) {
  // line will always be a list, skip outermost brackets
  if (line[0] != "[" || line[line.length - 1] != "]") {
    console.log(`Expected a list; did not get a list: "${line}"`);
  }
  let tree: TreeNode = { parent: parent, children: [], value: line };
  //   let tokens: any[] = [];
  let openBrackets = 0;
  let currentToken = "";
  for (let i = 1; i < line.length - 1; i++) {
    // console.log(`current token: ${currentToken}`);
    if (line[i] == "[") {
      openBrackets++;
      currentToken += line[i];
    } else if (line[i] == "," && currentToken != "" && openBrackets == 0) {
      let len = tree.children.push({
        parent: tree,
        value: currentToken,
        children: [],
      });
      //   console.log(`push child with value: ${currentToken}; len ${len}`);
      currentToken = "";
    } else if (line[i] == "]") {
      openBrackets--;
      currentToken += line[i];
      if (openBrackets == 0) {
        let childTree = tokenise(currentToken, {
          parent: tree,
          children: [],
          value: currentToken,
        });
        tree.children.push(childTree);
        currentToken = "";
      }
    } else {
      currentToken += line[i];
    }
  }
  // don't forget the final token!
  if (currentToken != "") {
    tree.children.push({ parent: tree, value: currentToken, children: [] });
  }

  return tree;
}

function correctlyOrdered(left: TreeNode, right: TreeNode): boolean | null {
  //compare two integers (leaf nodes)
  if (left.children.length == 0 && right.children.length == 0) {
    if (left.value < right.value) {
      return true;
    } else if (left.value > right.value) {
      return false;
    } else {
      return null; // need to keep checking
    }
  }

  if (left.children.length == 0) {
    left.children.push({ parent: left, value: left.value, children: [] });
  }
  if (right.children.length == 0) {
    right.children.push({ parent: right, value: right.value, children: [] });
  }

  for (let i = 0; i < left.children.length; i++) {
    if (left.children[i].value < right.children[i].value) {
      return true;
    } else if (left.children[i].value > right.children[i].value) {
      return false;
    }
  }

  if (left.children.length < right.children.length) {
    return true;
  } else if (left.children.length < right.children.length) {
    return false;
  }

  return null;
}
