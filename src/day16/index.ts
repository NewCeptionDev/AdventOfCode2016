import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const calculateNextState = (currentState: string): string => {
  let newState = "";

  for(let i = currentState.length - 1; i >= 0; i--) {
    if(currentState.charAt(i) === "0") {
      newState += "1";
    } else {
      newState += "0";
    }
  }

  return currentState + "0" + newState
}

const createChecksum = (data: string): string => {
  let checksum = "";

  for(let i = 0; i < data.length - 1; i += 2) {
    if(data.charAt(i) === data.charAt(i + 1)){
      checksum += "1";
    } else {
      checksum += "0";
    }
  }

  return checksum
}


const goA = (input, diskSize) => {
  const initialState = input.trim();

  let currentState: string = initialState;

  while(currentState.length < diskSize) {
    currentState = calculateNextState(currentState);
  }

  currentState = currentState.substr(0, diskSize);

  let checksum = createChecksum(currentState);

  while(checksum.length % 2 === 0) {
    checksum = createChecksum(checksum);
  }

  return checksum
}

const goB = (input, diskSize: number) => {
  return goA(input, diskSize)
}

/* Tests */

test(calculateNextState("1"), "100")
test(calculateNextState("0"), "001")
test(calculateNextState("11111"), "11111000000")
test(calculateNextState("111100001010"), "1111000010100101011110000")
test(createChecksum("110010110100"), "110101")
test(goA("10000", 20), "01100")

/* Results */

console.time("Time")
const resultA = goA(input, 272)
const resultB = goB(input, 35651584)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
