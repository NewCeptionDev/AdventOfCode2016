import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  const numberOfElves = parseInt(input.trim());
  let allElves = Array.from(Array(numberOfElves + 1).keys());
  // Removing 0 in Array as Elf Count starts at 1
  allElves.splice(0, 1);

  while (allElves.length > 1) {
    const nextRoundElves: number[] = [];

    for(let i = 0; i < allElves.length; i += 2) {
      if(i !== 0 || allElves.length % 2 === 0) {
        nextRoundElves.push(allElves[i])
      }
    }

    allElves = nextRoundElves;
  }

  return allElves[0]
}

const goB = (input) => {
  const numberOfElves = parseInt(input.trim());
  let allElves = Array.from(Array(numberOfElves + 1).keys());
  // Removing 0 in Array as Elf Count starts at 1
  allElves.splice(0, 1);
  let removedElves: number[] = [];
  let lastElf: number = 0;

  while (allElves.length - 1 > removedElves.length) {
    for(let i = 0; i < allElves.length; i++) {
      if(!removedElves.includes(allElves[i])) {
        const calculatedIndex = (Math.floor((allElves.length - removedElves.length) / 2) + i) % allElves.length;
        let amountOfRemovedElementsBefore = removedElves.filter(removed => removed <= calculatedIndex);
        removedElves.push(allElves[(calculatedIndex + (amountOfRemovedElementsBefore ? amountOfRemovedElementsBefore.length : 0)) % allElves.length]);
        lastElf = allElves[i];
      }
    }
  }

  return lastElf
}

/* Tests */

test(goA("5"), 3)
test(goB("5"), 2)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
