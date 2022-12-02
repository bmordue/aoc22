import {getLines, sum} from '../aocutil';
 
function part1(lines :string[]) {
  let score = 0;
  
  for (let line of lines) {
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


function part2(lines :string[]) {
  enum Them {'A', 'B', 'C'};
  enum Us {'X', 'Y', 'Z'};
  
  const scores = [[3, 4, 8], [1, 5, 9] , [2, 6, 7]];

  let score = sum(lines.map((line) => {
    const tokens = line.split(' ');
    const them = tokens[0] as keyof typeof Them;
    const us = tokens[1] as keyof typeof Us;
    let x = Them[them];
    let y = Us[us];
    
    return scores[x][y];
  }));

  console.log(`Total score is ${score}`);

}

async function main() {
  const lines = await getLines();
  part2(lines);
}

main();
