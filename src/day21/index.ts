import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const applyInstructionToString = (instruction: string, fullString: string): string => {
  const instructionSplit = instruction.split(" ");

  if(instruction.startsWith("swap position")) {
    const swapX = parseInt(instructionSplit[2]);
    const swapY = parseInt(instructionSplit[5]);

    const lower = swapX < swapY ? swapX: swapY;
    const higher = swapX < swapY ? swapY : swapX;

    return fullString.substring(0, lower) + fullString.charAt(higher) + fullString.substring(lower + 1, higher) + fullString.charAt(lower) + fullString.substring(higher + 1, fullString.length);
  } else if(instruction.startsWith("swap letter")) {
    const swapX = fullString.indexOf(instructionSplit[2]);
    const swapY = fullString.indexOf(instructionSplit[5]);

    const lower = swapX < swapY ? swapX: swapY;
    const higher = swapX < swapY ? swapY : swapX;

    return fullString.substring(0, lower) + fullString.charAt(higher) + fullString.substring(lower + 1, higher) + fullString.charAt(lower) + fullString.substring(higher + 1, fullString.length);
  } else if(instruction.startsWith("rotate based on position")) {
    let rotateIndex = fullString.indexOf(instructionSplit[6]);
    rotateIndex++;
    if(rotateIndex > 4) {
      rotateIndex++;
    }
    rotateIndex = rotateIndex % fullString.length

    return fullString.substring(fullString.length - rotateIndex, fullString.length) + fullString.substring(0, fullString.length - rotateIndex);
  } else if(instruction.startsWith("rotate")) {
    const rotateIndex = parseInt(instructionSplit[2]) % fullString.length;
    if(instructionSplit[1] === "right") {
      return fullString.substring(fullString.length - rotateIndex, fullString.length) + fullString.substring(0, fullString.length - rotateIndex);
    } else {
      return fullString.substring(rotateIndex, fullString.length) + fullString.substring(0, rotateIndex);
    }
  } else if(instruction.startsWith("reverse")) {
    const reverseX = parseInt(instructionSplit[2]);
    const reverseY = parseInt(instructionSplit[4]);

    const lower = reverseX < reverseY ? reverseX: reverseY;
    const higher = reverseX < reverseY ? reverseY : reverseX;

    return fullString.substring(0, lower) + fullString.substring(lower, higher + 1).split("").reverse().join("") + fullString.substring(higher + 1, fullString.length);
  } else {
    const moveX = parseInt(instructionSplit[2]);
    const moveY = parseInt(instructionSplit[5]);

    let resultArr = fullString.split("");
    resultArr.splice(moveX, 1);
    const result = resultArr.join("");

    return result.substring(0, moveY) + fullString.charAt(moveX) + result.substring(moveY, result.length);
  }
}

const unscrableInstructionToString = (instruction: string, fullString: string): string => {
  const instructionSplit = instruction.split(" ");

  if(instruction.startsWith("swap position")) {
    const swapX = parseInt(instructionSplit[2]);
    const swapY = parseInt(instructionSplit[5]);

    const lower = swapX < swapY ? swapX: swapY;
    const higher = swapX < swapY ? swapY : swapX;

    return fullString.substring(0, lower) + fullString.charAt(higher) + fullString.substring(lower + 1, higher) + fullString.charAt(lower) + fullString.substring(higher + 1, fullString.length);
  } else if(instruction.startsWith("swap letter")) {
    const swapX = fullString.indexOf(instructionSplit[2]);
    const swapY = fullString.indexOf(instructionSplit[5]);

    const lower = swapX < swapY ? swapX: swapY;
    const higher = swapX < swapY ? swapY : swapX;

    return fullString.substring(0, lower) + fullString.charAt(higher) + fullString.substring(lower + 1, higher) + fullString.charAt(lower) + fullString.substring(higher + 1, fullString.length);
  } else if(instruction.startsWith("rotate based on position")) {
    let rotateIndex = fullString.indexOf(instructionSplit[6]);
    // Using Shift Pattern
    rotateIndex = rotateIndex / 2 + (rotateIndex % 2 === 1 || rotateIndex === 0 ? 1 : 5);

    return fullString.substring(rotateIndex, fullString.length) + fullString.substring(0, rotateIndex);
  } else if(instruction.startsWith("rotate")) {
    const rotateIndex = parseInt(instructionSplit[2]) % fullString.length;
    if(instructionSplit[1] === "left") {
      return fullString.substring(fullString.length - rotateIndex, fullString.length) + fullString.substring(0, fullString.length - rotateIndex);
    } else {
      return fullString.substring(rotateIndex, fullString.length) + fullString.substring(0, rotateIndex);
    }
  } else if(instruction.startsWith("reverse")) {
    const reverseX = parseInt(instructionSplit[2]);
    const reverseY = parseInt(instructionSplit[4]);

    const lower = reverseX < reverseY ? reverseX: reverseY;
    const higher = reverseX < reverseY ? reverseY : reverseX;

    return fullString.substring(0, lower) + fullString.substring(lower, higher + 1).split("").reverse().join("") + fullString.substring(higher + 1, fullString.length);
  } else {
    const moveX = parseInt(instructionSplit[2]);
    const moveY = parseInt(instructionSplit[5]);

    let resultArr = fullString.split("");
    resultArr.splice(moveY, 1);
    const result = resultArr.join("");

    return result.substring(0, moveX) + fullString.charAt(moveY) + result.substring(moveX, result.length);
  }
}

const goA = (input) => {
  const instructions = splitToLines(input);

  let fullString = "abcdefgh";

  for(let instruction of instructions) {
    fullString = applyInstructionToString(instruction, fullString);
    // console.log("new Full string", fullString)
  }

  return fullString
}

const goB = (input, defaultFullString) => {
  const instructions = splitToLines(input);

  let fullString = defaultFullString;

  // console.log("....")
  for(let i = instructions.length - 1; i >= 0; i--) {
    fullString = unscrableInstructionToString(instructions[i], fullString);
    // console.log("new Full string", fullString)
  }

  return fullString
}

/* Tests */

test(applyInstructionToString("swap position 4 with position 0", "abcde"), "ebcda")
test(applyInstructionToString("swap letter d with letter b", "ebcda"), "edcba")
test(applyInstructionToString("reverse positions 0 through 4", "edcba"), "abcde")
test(applyInstructionToString("rotate left 1 step", "abcde"), "bcdea")
test(applyInstructionToString("move position 1 to position 4", "bcdea"), "bdeac")
test(applyInstructionToString("move position 3 to position 0", "bdeac"), "abdec")
test(applyInstructionToString("rotate based on position of letter b", "abdec"), "ecabd")
test(applyInstructionToString("rotate based on position of letter d", "ecabd"), "decab")
test(goB(input, "hcdefbag"), "abcdefgh")
test(unscrableInstructionToString("swap position 4 with position 0", "ebcda"), "abcde")
test(unscrableInstructionToString("swap letter d with letter b", "edcba"), "ebcda")
test(unscrableInstructionToString("reverse positions 0 through 4", "abcde"), "edcba")
test(unscrableInstructionToString("rotate left 1 step", "bcdea"), "abcde")
test(unscrableInstructionToString("move position 1 to position 4", "bdeac"), "bcdea")
test(unscrableInstructionToString("move position 3 to position 0", "abdec"), "bdeac")
test(unscrableInstructionToString("rotate based on position of letter b", "ecabd"), "abdec")
test(unscrableInstructionToString("rotate based on position of letter d", "decab"), "ecabd")
test(unscrableInstructionToString("rotate based on position of letter a", "fegdbach"), "dbachfeg")
test(unscrableInstructionToString("rotate based on position of letter b", "fcgdbaeh"), "hfcgdbae")

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input, "fbgdceah")
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
