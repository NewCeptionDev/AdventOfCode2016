import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const decompressFile = (file: string): string => {
  let decompressedFile = "";

  let marker = false;
  let rangeDescription = true;
  let range: number = 0;
  let repeatCount: number = 0;

  for(let i = 0; i < file.length; i++) {
      if(file.charAt(i) === "(") {
        marker = true;
      } else if(file.charAt(i) === ")" && marker) {
        marker = false;
        rangeDescription = true
        const extracted = file.substr(i+1, range);
        for(let i = 0; i < repeatCount; i++) {
          decompressedFile += extracted;
        }
        i = i + range;
        range = 0;
        repeatCount = 0;
      } else if(marker && rangeDescription) {
        if(file.charAt(i) === "x") {
          rangeDescription = false;
        } else {
          range = range * 10 + parseInt(file.charAt(i));
        }
      } else if(marker) {
        repeatCount = repeatCount * 10 + parseInt(file.charAt(i));
      } else {
        decompressedFile += file.charAt(i);
      }
  }

  return decompressedFile;
}

const getLengthOfFullyDecompressedFile = (file: string): number => {
  let lengthOfDecompressedFile = 0;

  let marker = false;
  let rangeDescription = true;
  let range: number = 0;
  let repeatCount: number = 0;

  for(let i = 0; i < file.length; i++) {
    if(file.charAt(i) === "(") {
      marker = true;
    } else if(file.charAt(i) === ")" && marker) {
      marker = false;
      rangeDescription = true
      const extracted = file.substr(i+1, range);
      lengthOfDecompressedFile += repeatCount * getLengthOfFullyDecompressedFile(extracted);
      i = i + range;
      range = 0;
      repeatCount = 0;
    } else if(marker && rangeDescription) {
      if(file.charAt(i) === "x") {
        rangeDescription = false;
      } else {
        range = range * 10 + parseInt(file.charAt(i));
      }
    } else if(marker) {
      repeatCount = repeatCount * 10 + parseInt(file.charAt(i));
    } else {
      lengthOfDecompressedFile++;
    }
  }

  return lengthOfDecompressedFile;
}

const goA = (input) => {
  return decompressFile(input.trim()).length;
}

const goB = (input) => {
  return getLengthOfFullyDecompressedFile(input.trim())
}

/* Tests */

test(decompressFile("ADVENT"), "ADVENT")
test(decompressFile("A(1x5)BC"), "ABBBBBC")
test(decompressFile("(3x3)XYZ"), "XYZXYZXYZ")
test(decompressFile("A(2x2)BCD(2x2)EFG"), "ABCBCDEFEFG")
test(decompressFile("(6x1)(1x3)A"), "(1x3)A")
test(decompressFile("X(8x2)(3x3)ABCY"), "X(3x3)ABC(3x3)ABCY")
test(getLengthOfFullyDecompressedFile("(3x3)XYZ"), 9)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
