import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const getMostUsedCharacterForPosition = (charactersAtPosition: string[]): string => {
  const occurrences: Record<string, number> = {};

  for(let char of charactersAtPosition) {
    if(!occurrences[char]) {
      occurrences[char] = 0;
    }

    occurrences[char] = occurrences[char] + 1;
  }

  let mostOccurrences = -1;
  let mostOccurringChar;

  for(let char of Object.keys(occurrences)) {
    if(occurrences[char] > mostOccurrences) {
      mostOccurrences = occurrences[char];
      mostOccurringChar = char;
    }
  }

  return mostOccurringChar;
}

const getLeastUsedCharacterForPosition = (charactersAtPosition: string[]): string => {
  const occurrences: Record<string, number> = {};

  for(let char of charactersAtPosition) {
    if(!occurrences[char]) {
      occurrences[char] = 0;
    }

    occurrences[char] = occurrences[char] + 1;
  }

  let leastOccurrences = Number.MAX_SAFE_INTEGER;
  let leastOccurringCharacter;

  for(let char of Object.keys(occurrences)) {
    if(occurrences[char] < leastOccurrences) {
      leastOccurrences = occurrences[char];
      leastOccurringCharacter = char;
    }
  }

  return leastOccurringCharacter;
}

const goA = (input) => {
  const lines = splitToLines(input);
  let message = "";

  for(let i = 0; i < lines[0].length; i++) {
    const linesCopy = [...lines];
    message += getMostUsedCharacterForPosition(linesCopy.map(line => line.charAt(i)))
  }

  return message;
}

const goB = (input) => {
  const lines = splitToLines(input);
  let message = "";

  for(let i = 0; i < lines[0].length; i++) {
    const linesCopy = [...lines];
    message += getLeastUsedCharacterForPosition(linesCopy.map(line => line.charAt(i)))
  }

  return message;
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
