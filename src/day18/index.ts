import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const calculateNextRow = (currentRow: string): string => {
  let nextRow = "";

  for(let i = 0; i < currentRow.length; i++) {
    const leftTileSafe = i > 0 ? currentRow.charAt(i - 1) === "." : true;
    const centerTileSafe = currentRow.charAt(i) === ".";
    const rightTileSafe = i < currentRow.length - 1 ? currentRow.charAt(i + 1) === "." : true;

    if((!leftTileSafe && !centerTileSafe && rightTileSafe) || (leftTileSafe && !centerTileSafe && !rightTileSafe) || (!leftTileSafe && centerTileSafe && rightTileSafe) || (leftTileSafe && centerTileSafe && !rightTileSafe)) {
      nextRow += "^"
    } else {
      nextRow += "."
    }
  }

  return nextRow
}

const goA = (input, maxRows: number) => {
  const firstRow = input.trim();

  const rows: string[] = [firstRow];

  while(rows.length < maxRows) {
    rows.push(calculateNextRow(rows[rows.length - 1]));
  }

  let safeTiles = 0;

  for(let row of rows) {
    for(let i = 0; i < row.length; i++) {
      if(row.charAt(i) === ".") {
        safeTiles++;
      }
    }
  }

  return safeTiles
}

const goB = (input, maxRows: number) => {
  return goA(input, maxRows)
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input, 40)
const resultB = goB(input, 400000)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
