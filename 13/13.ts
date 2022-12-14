import { DH_CHECK_P_NOT_SAFE_PRIME } from "constants";
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

    // checkTree(leftTree);
    // checkTree(rightTree);

    // discard blank line
    lines.shift();

    // compare and record index if correctly sorted
    console.log(`=== Pair ${index} ===`);
    if (correctlyOrdered(leftTree, rightTree)) {
      sumIndices += index;
      correct.push(index);
    }
    console.log();
  }

  console.log(correct);
  // console.log(`Sum of indices is ${correct.reduce((a, b) => a + b)}`);
  console.log(`Sum of indices is ${sumIndices}`);
}

function checkTree(tree: TreeNode) {
  let frontier = [tree];
  while (frontier.length > 0) {
    let item = frontier.shift();
    if (item?.children.length == 0) {
      console.log(item.value);
    }
    else {
      frontier = frontier.concat(item?.children || []);
    }
  }
}

function tokenise(line: string, parent: TreeNode) {
  // line will always be a list, skip outermost brackets
  if (line[0] == ',') {
    line = line.substring(1);
  }

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
      if (currentToken[0] == ',') {
        currentToken = currentToken.substring(1);
        // console.log(`trimmed1: ${currentToken}`);
      }
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
      if (openBrackets == 0 && currentToken != "") {
        if (currentToken[0] == ',') {
          currentToken = currentToken.substring(1);
          // console.log(`trimmed2: ${currentToken}`);
        }

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
    // console.log(`final token: ${currentToken}`);
    if (currentToken[0] == ',') {
      currentToken = currentToken.substring(1);
      // console.log(`trimmed3: ${currentToken}`);
    }

    tree.children.push({ parent: tree, value: currentToken, children: [] });
  }

  return tree;
}

function correctlyOrdered(left: TreeNode, right: TreeNode): boolean | null {
  console.log(`Compare ${left.value} vs ${right.value}`);

  //compare two integers (leaf nodes)
  if (left.children.length == 0 && right.children.length == 0) {
    if (left.value < right.value) {
      console.log(`left is less than right, so order is correct`);
      return true;
    } else if (left.value > right.value) {
      console.log(`left is bigger than right, so order is wrong`);
      return false;
    } else {
      return null; // need to keep checking
    }
  }

  // make a leaf into a list
  if (left.children.length == 0 && left.value != '[]') {
    console.log(`left: change ${left.value} to [${left.value}]`);
    left.children.push({ parent: left, value: left.value, children: [] });
  }
  if (right.children.length == 0 && right.value != '[]') {
    console.log(`right: change ${right.value} to [${right.value}]`);
    right.children.push({ parent: right, value: right.value, children: [] });
  }

  // compare two trees
  console.log(`1] ${left.value} vs ${right.value}; ${right.children.length}`);
  for (let i = 0; i < left.children.length; i++) {

    if (!right.children[i]) {
      console.log(`left has more items than right, so order is wrong`);
      return false;
    }


    let correct = correctlyOrdered(left.children[i], right.children[i]);
    if (correct != null) {
      return correct;
    }
  }



  //   if (!right.children[i]) {
  //     console.log(`left has more items than right, so order is wrong`);
  //     return false;
  //   }

  //   console.log(`2] compare ${left.children[i].value} vs ${right.children[i].value}`);
  //   console.log(`${right.children.length}: ${right.children.map((c) => c.value)}`);
  //   if (left.children[i].value < right.children[i].value) {
  //     console.log(`left is less than right, so order is right`)
  //     return true;
  //   } else if (left.children[i].value > right.children[i].value) {
  //     console.log(`left is bigger than right, so order is wrong`)
  //     return false;
  //   }
  // }

  if (left.children.length < right.children.length) {
    console.log('left has fewer items, so order right');
    return true;
  } else if (left.children.length < right.children.length) {
    console.log('should not be able to reach this!');
    return false;
  }

  return null;
}
