import { getLines } from '../aocutil';
 
function processLines(lines :string[]) {
  let score = 0;
  
  for (let line of lines) {
    console.log(line);
    let inc = 0;
    switch (line) {
      case 'A X': 
        inc = 1 + 3;
        break;
      case 'A Y':
        inc = 2 + 6;
        break;
      case 'A Z':
        inc = 3 + 0;
        break;
      case 'B X':
        inc = 1 + 0;
        break;
      case 'B Y':
        inc = 2 + 3;
        break;
      case 'B Z':
        inc = 3 + 6;
        break;
      case 'C X':
        inc = 1 + 6;
        break;
      case 'C Y':
        inc = 2 + 0;
        break;
      case 'C Z':
        inc = 3 + 3;
        break;
    }
    score += inc;
  }
  
  console.log(`Total score is ${score}`);
}

function sortDesc(arr: number[]) {
  return arr.sort((a, b) => b - a);
}

function max(arr: number[]) {
  return arr.reduce((a, b) => (a > b ? a : b));
}

async function main() {
  const lines = await getLines();
  processLines(lines);
}

main();
