import test from "node:test";
import { listenerCount } from "process";
import { getLines } from "../aocutil";

// 6633 is not the right anwer -- too high

interface TreeNode {
  value: string;
  parent: TreeNode | null;
  children: TreeNode[];
}

async function main() {
  const lines = await getLines();
  day13(lines);
}

function part1(lines: string[]) {
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
    // console.log(`=== Pair ${index} ===`);
    if (correctlyOrdered(leftTree, rightTree, 0)) {
      sumIndices += index;
      correct.push(index);
    }
    // console.log();
  }

  console.log(correct);
  // console.log(`Sum of indices is ${correct.reduce((a, b) => a + b)}`);
  console.log(`Sum of indices is ${sumIndices}`);
}

function part2(lines: string[]) {
  lines.push("[[2]]");
  lines.push("[[6]]");

  // console.log(`lines.length ${lines.length}`);
  lines = lines.filter((l) => l.length > 0);
  // console.log(`lines.length ${lines.length}`);

  lines.sort((a, b) => {
    let aTree = tokenise(a, { parent: null, children: [], value: a });
    let bTree = tokenise(b, { parent: null, children: [], value: b });
    let correct = correctlyOrdered(aTree, bTree, 0);
    // console.log(`Correct order? ${a} VS ${b}: ${correct}`);
    if (correct == true) {
      return -1;
    } else {
      return 1;
    }
    // return correct ? -1 : 1;
  });

  // lines.forEach(console.log);
  // lines.map((l) => console.log(l));

  console.log(
    `[[2]]: ${lines.indexOf("[[2]]")} [[6]]: ${lines.indexOf("[[6]]")}`
  );
  console.log(
    `Product of 1-based indices:  ${
      (lines.indexOf("[[2]]") + 1) * (lines.indexOf("[[6]]") + 1)
    }`
  );
}

function day13(lines: string[]) {
  part2(lines);
}

function checkTree(tree: TreeNode) {
  let frontier = [tree];
  while (frontier.length > 0) {
    let item = frontier.shift();
    if (item?.children.length == 0) {
      console.log(item.value);
    } else {
      frontier = frontier.concat(item?.children || []);
    }
  }
}

function tokenise(line: string, parent: TreeNode) {
  // line will always be a list, skip outermost brackets
  if (line[0] == ",") {
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
      if (currentToken[0] == ",") {
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
        if (currentToken[0] == ",") {
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
    if (currentToken[0] == ",") {
      currentToken = currentToken.substring(1);
      // console.log(`trimmed3: ${currentToken}`);
    }

    tree.children.push({ parent: tree, value: currentToken, children: [] });
  }

  return tree;
}

function correctlyOrdered(
  left: TreeNode,
  right: TreeNode,
  depth: number
): boolean | null {
  const indent = new Array(depth).fill("  ").join("");
  const LOG = process.env.LOG;

  if (LOG) console.log(`${indent} Compare ${left.value} vs ${right.value}`);

  //compare two leaf nodes
  if (left.children.length == 0 && right.children.length == 0) {
    const L = parseInt(left.value);
    const R = parseInt(right.value);
    // tried to parse '[]' as int
    if (isNaN(L)) {
      if (LOG) console.log(`L isNan: ${left.value}`);
      return true;
    }
    if (isNaN(R)) {
      if (LOG) console.log(`R isNan: ${right.value}`);
      return false;
    }
    if (L < R) {
      if (LOG)
        console.log(`${indent} left is less than right, so order is correct`);
      return true;
    } else if (L > R) {
      if (LOG)
        console.log(`${indent} left is bigger than right, so order is wrong`);
      return false;
    } else {
      return null; // need to keep checking
    }
  }

  // make a leaf into a list
  if (left.children.length == 0 && left.value != "[]") {
    if (LOG)
      console.log(`${indent} left: change ${left.value} to [${left.value}]`);
    left.children.push({ parent: left, value: left.value, children: [] });
  }
  if (right.children.length == 0 && right.value != "[]") {
    if (LOG)
      console.log(`${indent} right: change ${right.value} to [${right.value}]`);
    right.children.push({ parent: right, value: right.value, children: [] });
  }

  // compare two trees
  if (LOG)
    console.log(
      `${indent} ${left.value} vs ${right.value}; ${right.children.length}`
    );
  for (let i = 0; i < left.children.length; i++) {
    if (!right.children[i]) {
      if (LOG)
        console.log(
          `${indent} left has more items than right, so order is wrong`
        );
      return false;
    }

    let correct = correctlyOrdered(
      left.children[i],
      right.children[i],
      depth + 1
    );
    if (correct != null) {
      return correct;
    }
  }

  if (left.children.length < right.children.length) {
    if (LOG) console.log(`${indent} left has fewer items, so order right`);
    return true;
  } else if (left.children.length < right.children.length) {
    if (LOG) console.log(`${indent} should not be able to reach this!`);
    return false;
  }

  if (depth == 0) console.log(`Shouldn't get here?`);
  return null;
}

function testCompare(a: string, b: string) {
  let aTree = tokenise(a, { parent: null, children: [], value: a });
  let bTree = tokenise(b, { parent: null, children: [], value: b });
  // checkTree(aTree);
  // checkTree(bTree);
  let correct = correctlyOrdered(aTree, bTree, 0);
  console.log(`${a} < ${b}: ${correct}`);
}

function tests() {
  testCompare("[]", "[[[]]]");
  testCompare("[[[]]]", "[]");
  testCompare("[1,1,5,1,1]", "[1,1,3,1,1]");
}

process.env.TEST ? tests() : main();
