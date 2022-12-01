const fs = require("fs");
const readline = require("readline");

const lines = [];

async function processLineByLine() {
  const fileStream = fs.createReadStream("input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    lines.push(line);
  }
  console.log(`read ${lines.length} lines`);
}

async function main() {
  processLineByLine();
}

main();
