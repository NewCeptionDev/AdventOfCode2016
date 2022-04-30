import { test, readInput } from "../utils/index"
import { encrypt } from "../utils/md5"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const maxX = 3;
const maxY = 3;

interface Position {
  x: number;
  y: number;
}

interface State {
  position: Position;
  path: string;
}

const isDoorOpen = (char: string): boolean => {
  return char === "b" || char === "c" || char === "d" || char === "e" || char === "f";
}

const getPossibleMoves = (position: Position, path: string, passcode: string): string[] => {
  const hash: string = encrypt(passcode + path);

  const openDoors: string[] = [];

  if(isDoorOpen(hash.charAt(0)) && position.y > 0) {
    openDoors.push("U");
  }

  if(isDoorOpen(hash.charAt(1)) && position.y < maxY) {
    openDoors.push("D");
  }

  if(isDoorOpen(hash.charAt(2)) && position.x > 0) {
    openDoors.push("L");
  }

  if(isDoorOpen(hash.charAt(3)) && position.x < maxX) {
    openDoors.push("R");
  }

  return openDoors;
}

const getNewPosition = (move: string, position: Position): Position => {
  switch (move) {
    case "U":
      return {
        x: position.x,
        y: position.y - 1
      }
    case "D":
      return {
        x: position.x,
        y: position.y + 1
      }
    case "L":
      return {
        x: position.x - 1,
        y: position.y
      }
    case "R":
      return {
        x: position.x + 1,
        y: position.y
      }
  }
}

const calculateNextPossibleStates = (possibleStates: State[], passCode: string): State[] => {
  const nextStates: State[] = [];

  for(let state of possibleStates) {
    const possibleMoves = getPossibleMoves(state.position, state.path, passCode);

    for(let move of possibleMoves) {
      nextStates.push({
        position: getNewPosition(move, state.position),
        path: state.path + move
      })
    }
  }

  return nextStates;
}

const goA = (input) => {
  const passcode = input.trim();

  let possibleStates: State[] = [{
    position: {x: 0, y: 0},
    path: ""
  }]

  while(!possibleStates.find(state => state.position.x === maxX && state.position.y === maxY)) {
    possibleStates = calculateNextPossibleStates(possibleStates, passcode);
  }

  return possibleStates.find(state => state.position.x === maxX && state.position.y === maxY).path
}

const goB = (input) => {
  const passcode = input.trim();

  let possibleStates: State[] = [{
    position: {x: 0, y: 0},
    path: ""
  }]

  let longestPath: number = 0;

  // Testing Paths of up to Length 1000
  for(let i = 0; i < 1000; i++) {
    possibleStates = calculateNextPossibleStates(possibleStates, passcode);

    const finishStates = possibleStates.filter(state => state.position.x === maxX && state.position.y === maxY)

    possibleStates = possibleStates.filter(state => state.position.x !== maxX || state.position.y !== maxY)

    for(let finish of finishStates) {
      if(finish.path.length > longestPath) {
        longestPath = finish.path.length;
      }
    }
  }

  return longestPath
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
