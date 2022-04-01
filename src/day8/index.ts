import { readInput, test } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum INSTRUCTION {
  Rect,
  RotateRow,
  RotateColumn
}

const SCREEN_WIDTH = 50
const SCREEN_HEIGHT = 6

interface FullInstruction {
  instruction: INSTRUCTION,
  rectX?: number;
  rectY?: number;
  columnOrRow?: number;
  moveBy?: number;
}

const parseFullInstruction = (line: string): FullInstruction => {
  const parts = line.split(" ")

  if (parts[0].trim() === "rect") {
    const rectParts = parts[1].trim().split("x")
    return {
      instruction: INSTRUCTION.Rect,
      rectX: parseInt(rectParts[0]),
      rectY: parseInt(rectParts[1]),
    }
  } else {
    const columnOrRow = parts[2].trim().split("=")[1]
    return {
      instruction: parts[1].trim() === "row" ? INSTRUCTION.RotateRow : INSTRUCTION.RotateColumn,
      columnOrRow: parseInt(columnOrRow),
      moveBy: parseInt(parts[parts.length - 1]),
    }
  }
}

const printScreen = (litFields: Record<number, number[]>) => {
  for (let y = 0; y < SCREEN_HEIGHT; y++) {
    const litOnRow = litFields[y] ? litFields[y] : []
    let row = ""
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      row += litOnRow.includes(x) ? "#" : "."
    }
    console.log(row)
  }
}

const calculateLitAfterInstruction = (litFields: Record<number, number[]>, instruction: FullInstruction): Record<number, number[]> => {
  switch (instruction.instruction) {
    case INSTRUCTION.Rect:
      for (let y = 0; y < instruction.rectY; y++) {
        if (!litFields[y]) {
          litFields[y] = []
        }

        for (let x = 0; x < instruction.rectX; x++) {
          if (!litFields[y].includes(x)) {
            litFields[y].push(x)
          }
        }
      }
      break
    case INSTRUCTION.RotateRow:
      if (litFields[instruction.columnOrRow]) {
        litFields[instruction.columnOrRow] = litFields[instruction.columnOrRow].map(lit => (lit + instruction.moveBy) % SCREEN_WIDTH)
      }
      break
    case INSTRUCTION.RotateColumn:
      const litRows: number[] = []

      for (let y = 0; y < SCREEN_HEIGHT; y++) {
        if (litFields[y] && litFields[y].includes(instruction.columnOrRow)) {
          litRows.push(y)
          litFields[y].splice(litFields[y].indexOf(instruction.columnOrRow), 1)
        }
      }

      const newToLight = litRows.map(lit => (lit + instruction.moveBy) % SCREEN_HEIGHT)

      for (let row of newToLight) {
        if (!litFields[row]) {
          litFields[row] = []
        }

        if (!litFields[row].includes(instruction.columnOrRow)) {
          litFields[row].push(instruction.columnOrRow)
        }
      }
      break
  }

  return litFields
}

const goA = (input) => {
  const lines = splitToLines(input)
  const instructions: FullInstruction[] = lines.map(line => parseFullInstruction(line))

  let litFields: Record<number, number[]> = {}

  for(let instruction of instructions) {
    litFields = calculateLitAfterInstruction(litFields, instruction);
  }

  let lit = 0
  for (let y of Object.keys(litFields)) {
    lit += litFields[y].length
  }

  return lit
}

const goB = (input) => {
  const lines = splitToLines(input)
  const instructions: FullInstruction[] = lines.map(line => parseFullInstruction(line))

  let litFields: Record<number, number[]> = {}

  for(let instruction of instructions) {
    litFields = calculateLitAfterInstruction(litFields, instruction);
  }

  printScreen(litFields)
}

/* Tests */

test(goA(readTestFile()), 6)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
