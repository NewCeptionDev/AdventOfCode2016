import { test, readInput } from "../utils/index"
import { readInputFromSpecialFile, readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const enum INSTRUCTION {
  CPY,
  INC,
  DEC,
  JMP
}

interface FullInstruction {
  instruction: INSTRUCTION;
  register1?: number;
  register2?: number;
  value1?: number;
  value2?: number;
}

const parseInstruction = (instruction: string): INSTRUCTION => {
  switch (instruction) {
    case "cpy":
      return INSTRUCTION.CPY
    case "jnz":
      return INSTRUCTION.JMP
    case "inc":
      return INSTRUCTION.INC
    case "dec":
      return INSTRUCTION.DEC
  }
}

const parseRegister = (register: string): number => {
  switch (register) {
    case "a":
      return 0
    case "b":
      return 1
    case "c":
      return 2
    case "d":
      return 3
  }
}

const parseFullInstruction = (line: string): FullInstruction => {
  const split = line.split(" ")
  const instruction = parseInstruction(split[0]);

  switch (instruction) {
    case INSTRUCTION.INC:
    case INSTRUCTION.DEC:
      return {
        instruction: instruction,
        register1: parseRegister(split[1])
      }
    case INSTRUCTION.CPY:
      return {
        instruction: instruction,
        register1: isNaN(parseInt(split[1])) ? parseRegister(split[1]) : undefined,
        value1: isNaN(parseInt(split[1])) ? undefined : parseInt(split[1]),
        register2: parseRegister(split[2])
      }
    case INSTRUCTION.JMP:
      return {
        instruction: instruction,
        register1: parseRegister(split[1]),
        value2: parseInt(split[2])
      }
  }
}

const goA = (input) => {
  const lines = splitToLines(input);
  const instructions = lines.map(line => parseFullInstruction(line));

  const register = [0,0,0,0];

  for(let i = 0; i < instructions.length; i++) {
    switch (instructions[i].instruction) {
      case INSTRUCTION.INC:
        register[instructions[i].register1] = register[instructions[i].register1] + 1;
        break;
      case INSTRUCTION.DEC:
        register[instructions[i].register1] = register[instructions[i].register1] - 1;
        break;
      case INSTRUCTION.JMP:
        if(register[instructions[i].register1] !== 0) {
          i += instructions[i].value2 - 1;
        }
        break;
      case INSTRUCTION.CPY:
        if(instructions[i].register1 !== undefined) {
          register[instructions[i].register2] = register[instructions[i].register1];
        } else {
          register[instructions[i].register2] = instructions[i].value1;
        }
        break;
    }
  }

  return register[0];
}

const goB = (input) => {
  return goA(input)
}

/* Tests */

test(goA(readTestFile()), 42)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(prepareInput(readInputFromSpecialFile("secondInput.txt")))
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)


