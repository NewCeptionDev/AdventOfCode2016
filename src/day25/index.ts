import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

// Copied Instruction Part from Day23 and extended ot
const enum INSTRUCTION {
  CPY,
  INC,
  DEC,
  JMP,
  TGL,
  OUT
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
    case "out":
      return INSTRUCTION.OUT
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
        value2: isNaN(parseInt(split[2])) ?  undefined : parseInt(split[2]),
        register2: isNaN(parseInt(split[2])) ? parseRegister(split[2]) : undefined
      }
    case INSTRUCTION.TGL:
      return {
        instruction: instruction,
        register1: parseRegister(split[1])
      }
    case INSTRUCTION.OUT:
      return {
        instruction: instruction,
        register1: isNaN(parseInt(split[1])) ? parseRegister(split[1]) : undefined,
        value1: isNaN(parseInt(split[1])) ? undefined : parseInt(split[1])
      }
  }
}

const goA = (input) => {
  const lines = splitToLines(input);

  let foundIndex = false;
  let currentIndex = -1;

  while(!foundIndex) {
    currentIndex++;
    const register = [currentIndex,0,0,0];
    let lastClockOut = 1;
    let repeatCount = 0;
    const instructions = lines.map(line => parseFullInstruction(line));

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
            if(instructions[i].value2 !== undefined) {
              i += instructions[i].value2 - 1;
            } else {
              i += register[instructions[i].register2] - 1;
            }
          } else if(instructions[i].value1 !== undefined && instructions[i].value1 !== 0) {
            if(instructions[i].register2 !== undefined) {
              i += register[instructions[i].register2] - 1;
            } else {
              i += instructions[i].value2 - 1;
            }
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
        case INSTRUCTION.OUT:
          if(instructions[i].register1 !== undefined) {
            if((register[instructions[i].register1] === 0 || register[instructions[i].register1] === 1) && register[instructions[i].register1] !== lastClockOut) {
              lastClockOut = register[instructions[i].register1];
              repeatCount++;
            } else {
              i += 1000;
            }
          } else {
            if((instructions[i].value1 === 0 || instructions[i].value1 === 1) && instructions[i].value1 !== lastClockOut) {
              lastClockOut = register[instructions[i].value1];
              repeatCount++;
            } else {
              i += 1000;
            }
          }

          if(repeatCount === 100) {
            foundIndex = true;
            i += 1000;
          }
          break;
      }
    }
  }

  return currentIndex;
}

const goB = (input) => {
  return
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
