import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const getKeyNumberAfterInstructionForNormalKeyPad = (keyNumberBefore: number, instruction: string): number => {
  switch (instruction) {
    case "U":
      return keyNumberBefore > 3 ? keyNumberBefore - 3 : keyNumberBefore
    case "D":
      return keyNumberBefore < 7 ? keyNumberBefore + 3 : keyNumberBefore
    case "L":
      return (keyNumberBefore !== 1 && keyNumberBefore !== 4 && keyNumberBefore !== 7) ? keyNumberBefore - 1 : keyNumberBefore
    case "R":
      return (keyNumberBefore !== 3 && keyNumberBefore !== 6 && keyNumberBefore !== 9) ? keyNumberBefore + 1 : keyNumberBefore
  }
}

const getKeyNumberAfterInstructionForSpecialKeyPad = (keyNumberBefore: string, instruction: string): string => {
  switch (keyNumberBefore) {
    case "1":
      return instruction === "D" ? "3" : keyNumberBefore
    case "2":
      if(instruction === "R") {
        return "3";
      }
    case "4":
      if(instruction === "L" && keyNumberBefore === "4") {
        return "3";
      }
      return instruction === "D" ? (parseInt(keyNumberBefore) + 4).toString() : keyNumberBefore
    case "3":
      if (instruction === "D" || instruction === "U") {
        return instruction === "D" ? "7" : "1"
      } else {
        return instruction === "L" ? "2" : "4"
      }
    case "5":
      return instruction === "R" ? "6" : keyNumberBefore
    case "9":
      return instruction === "L" ? "8" : keyNumberBefore
    case "6":
    case "7":
    case "8":
      if (instruction === "U") {
        return (parseInt(keyNumberBefore) - 4).toString()
      } else if (instruction === "D") {
        let result = (parseInt(keyNumberBefore) + 4)

        return result === 10 ? "A" : result === 11 ? "B" : "C"
      } else {
        return instruction === "L" ? (parseInt(keyNumberBefore) - 1).toString() : (parseInt(keyNumberBefore) + 1).toString()
      }
    case "B":
      if (instruction === "D" || instruction === "U") {
        return instruction === "D" ? "D" : "7"
      } else {
        return instruction === "L" ? "A" : "C"
      }
    case "A":
      if(instruction === "R") {
        return "B"
      }
    case "C":
      if(instruction === "L" && keyNumberBefore === "C") {
        return "B"
      }
      return instruction === "U" ? keyNumberBefore === "A" ? "6" : "8" : keyNumberBefore
    case "D":
      return instruction === "U" ? "B" : keyNumberBefore
  }
}

const goA = (input) => {
  const lines = splitToLines(input)
  const code = []

  for (let line of lines) {
    let keyNumber = 5
    for (let i = 0; i < line.length; i++) {
      keyNumber = getKeyNumberAfterInstructionForNormalKeyPad(keyNumber, line.charAt(i))
    }
    code.push(keyNumber)
  }

  return code.reduceRight((previousValue, currentValue, currentIndex) =>
    previousValue + (currentValue * Math.pow(10, code.length - currentIndex - 1)),
  )
}

const goB = (input) => {
  const lines = splitToLines(input)
  const code = []

  for (let line of lines) {
    let keyNumber = "5"
    for (let i = 0; i < line.length; i++) {
      keyNumber = getKeyNumberAfterInstructionForSpecialKeyPad(keyNumber, line.charAt(i))
    }
    code.push(keyNumber)
  }

  return code.reduce((previousValue, currentValue) => previousValue + currentValue)
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
