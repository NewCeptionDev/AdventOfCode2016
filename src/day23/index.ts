import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

// Copied Instruction Part from Day12 and extended ot
const enum INSTRUCTION {
  CPY,
  INC,
  DEC,
  JMP,
  TGL
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
    case "tgl":
      return INSTRUCTION.TGL
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
        register1: isNaN(parseInt(split[1])) ? parseRegister(split[1]) : undefined,
        value1: isNaN(parseInt(split[1])) ? undefined : parseInt(split[1]),
        value2: isNaN(parseInt(split[1])) ? parseInt(split[2]) : undefined,
        register2: isNaN(parseInt(split[1])) ? undefined : parseRegister(split[2])
      }
    case INSTRUCTION.TGL:
      return {
        instruction: instruction,
        register1: parseRegister(split[1])
      }
  }
}

const goA = (input) => {
  const lines = splitToLines(input);
  const instructions = lines.map(line => parseFullInstruction(line));

  const register = [7,0,0,0];

  for(let i = 0; i < instructions.length; i++) {
    switch (instructions[i].instruction) {
      case INSTRUCTION.INC:
        register[instructions[i].register1] = register[instructions[i].register1] + 1;
        break;
      case INSTRUCTION.DEC:
        register[instructions[i].register1] = register[instructions[i].register1] - 1;
        break;
      case INSTRUCTION.JMP:
        if(instructions[i].register1 !== undefined && register[instructions[i].register1] !== 0) {
          i += instructions[i].value2 - 1;
        } else if(instructions[i].register2 !== undefined && instructions[i].value1 !== 0) {
          i += register[instructions[i].register2] - 1;
        }
        break;
      case INSTRUCTION.CPY:
        if(instructions[i].register2 === undefined) {
          break;
        }

        if(instructions[i].register1 !== undefined) {
          register[instructions[i].register2] = register[instructions[i].register1];
        } else {
          register[instructions[i].register2] = instructions[i].value1;
        }
        break;
      case INSTRUCTION.TGL:
        const valueOfReg = register[instructions[i].register1];

        if(i + valueOfReg < instructions.length) {
          if(instructions[i + valueOfReg].instruction === INSTRUCTION.INC) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.DEC;
          } else if(instructions[i + valueOfReg].instruction === INSTRUCTION.DEC || instructions[i + valueOfReg].instruction === INSTRUCTION.TGL) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.INC;
          } else if(instructions[i + valueOfReg].instruction === INSTRUCTION.JMP) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.CPY;
          } else if (instructions[i + valueOfReg].instruction === INSTRUCTION.CPY) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.JMP;
          }
        }
    }
  }

  return register[0];
}

const goB = (input) => {
  const lines = splitToLines(input);
  const instructions = lines.map(line => parseFullInstruction(line));

  const register = [12,0,0,0];

  for(let i = 0; i < instructions.length; i++) {
    switch (instructions[i].instruction) {
      case INSTRUCTION.INC:
        register[instructions[i].register1] = register[instructions[i].register1] + 1;
        break;
      case INSTRUCTION.DEC:
        register[instructions[i].register1] = register[instructions[i].register1] - 1;
        break;
      case INSTRUCTION.JMP:
        if(instructions[i].register1 !== undefined && register[instructions[i].register1] !== 0) {
          i += instructions[i].value2 - 1;
        } else if(instructions[i].register2 !== undefined && instructions[i].value1 !== 0) {
          i += register[instructions[i].register2] - 1;
        }
        break;
      case INSTRUCTION.CPY:
        if(instructions[i].register2 === undefined) {
          break;
        }

        if(instructions[i].register1 !== undefined) {
          register[instructions[i].register2] = register[instructions[i].register1];
        } else {
          register[instructions[i].register2] = instructions[i].value1;
        }
        break;
      case INSTRUCTION.TGL:
        const valueOfReg = register[instructions[i].register1];

        if(i + valueOfReg < instructions.length) {
          if(instructions[i + valueOfReg].instruction === INSTRUCTION.INC) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.DEC;
          } else if(instructions[i + valueOfReg].instruction === INSTRUCTION.DEC || instructions[i + valueOfReg].instruction === INSTRUCTION.TGL) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.INC;
          } else if(instructions[i + valueOfReg].instruction === INSTRUCTION.JMP) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.CPY;
          } else if (instructions[i + valueOfReg].instruction === INSTRUCTION.CPY) {
            instructions[i + valueOfReg].instruction = INSTRUCTION.JMP;
          }
        }
    }
  }

  return register[0];
}

/* Tests */

test(goA(readTestFile()), 3)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
