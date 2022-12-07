import { getLines } from "../aocutil";

interface TreeNode {
  name: string;
  isDir: boolean;
  parent: TreeNode | null;
  children: TreeNode[];
  size: number;
}

// ls or cd
function handleCommand(currentLocation: TreeNode, line: string) {
  if (line[0] == "l") {
    return currentLocation;
  }
  const cmdArg = line.substring(3);
  // "cd XYZ"
  let newLocation: TreeNode = currentLocation;
  switch (cmdArg) {
    case "/":
      let location = currentLocation;
      while (location.parent) {
        location = location.parent;
      }
      newLocation = location;
      break;
    case "..":
      if (currentLocation.parent) {
        newLocation = currentLocation.parent;
      }
      break;
    default:
      let results = currentLocation.children?.filter((n) => n.name === cmdArg);
      if (results && results.length > 0) {
        newLocation = results[0];
      } else {
        console.log("No matching directory");
      }
      break;
  }
  return newLocation;
}

function buildTree(lines: string[]): TreeNode {
  const rootNode: TreeNode = {
    parent: null,
    name: "/",
    isDir: true,
    children: [],
    size: 0,
  };

  let currentNode: TreeNode = rootNode;
  for (let line of lines) {
    if (line && line[0] == "$") {
      currentNode = handleCommand(currentNode, line.substring(2));
    } else if (line && line[0] == "d") {
      const dirName = line.substring(4);
      const newChild = {
        parent: currentNode,
        name: dirName,
        isDir: true,
        children: [],
        size: 0,
      };
      currentNode.children.push(newChild);
    } else if (line) {
      // should be a file node!
      const sizeStr = line?.split(" ")[0] || "";
      const size = parseInt(sizeStr);
      let filename = line?.split(" ")[1] || "";
      const newChild: TreeNode = {
        parent: currentNode,
        name: filename,
        isDir: false,
        children: [],
        size: size,
      };
      // console.log(
      //   `Add child ${newChild.name} to ${currentNode.name} [${line} ; lines: ${lines.length}]`
      // );
      currentNode.children.push(newChild);
    }
  }

  return rootNode;
}

function depthFirstTraverse(root: TreeNode, fn: Function) {
  root.children?.forEach((child) => {
    depthFirstTraverse(child, fn);
  });
  return fn(root);
}

function sum(a: number, b: number) {
  return a + b;
}

function dirSizes(treeNode: TreeNode) {
  if (treeNode.isDir && treeNode.children) {
    treeNode.size = treeNode.children.map((tn) => tn.size).reduce(sum);
  }
}

function filterNodes(root: TreeNode, predicate: Function): TreeNode[] {
  let results: TreeNode[] = [];
  depthFirstTraverse(root, function (treeNode: TreeNode) {
    if (predicate(treeNode)) {
      results.push(treeNode);
    }
  });
  return results;
}

function sizePredicate(treeNode: TreeNode): boolean {
  return treeNode.isDir && treeNode.size <= 100000;
}

function day7(lines: string[]) {
  const tree = buildTree(lines);

  let solution = 0;
  depthFirstTraverse(tree, dirSizes);

  // part 1
  solution = filterNodes(tree, sizePredicate)
    .map((tn) => tn.size)
    .reduce(sum);

  console.log(`Part 1: sum of directory sizes < 100k is ${solution}`);

  // part 2
  const available = 70000000 - tree.size;
  const minDelete = 30000000 - available;

  let smallest = filterNodes(tree, (n: TreeNode) => {
    return n.isDir && n.size > minDelete;
  }).sort((a, b) => a.size - b.size)[0];

  console.log(`Part 2: smallest dir to delete is ${smallest.size}`);
}

async function main() {
  day7(await getLines());
}

main();
