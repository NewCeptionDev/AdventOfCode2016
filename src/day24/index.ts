import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Position {
  x: number,
  y: number
}

// Taken from https://stackoverflow.com/questions/37579994/generate-permutations-of-javascript-array
const permute = (xs: number[]) => {
  let ret = [];

  for (let i = 0; i < xs.length; i = i + 1) {
    let rest = permute(xs.slice(0, i).concat(xs.slice(i + 1)));

    if(!rest.length) {
      ret.push([xs[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([xs[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}

const getPossibleNeighbours = (position: Position, maxX: number, maxY: number): Position[] => {
  const possibleNeighbours: Position[] = [];

  if(position.x > 0){
    if(position.y > 0) {
      possibleNeighbours.push({
        x: position.x,
        y: position.y - 1
      })
    }

    possibleNeighbours.push({
      x: position.x - 1,
      y: position.y
    })

    if(position.y + 1 < maxY) {
      possibleNeighbours.push({
        x: position.x,
        y: position.y + 1
      })
    }
  }

  if(position.x + 1 < maxX) {
    possibleNeighbours.push({
      x: position.x + 1,
      y: position.y
    })
  }

  return possibleNeighbours;
}

const goA = (input) => {
  const map: string[][] = splitToLines(input).map(line => line.split(""));

  let startPosition;

  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[y].length; x++) {
      if(map[y][x] === "0") {
        startPosition = {
          x: x,
          y: y
        }
      }
    }
  }

  const movesToNumber: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
  let knownStartPositions: Map<number, Position> = new Map<number, Position>();
  knownStartPositions[0] = startPosition;

  while(Object.keys(knownStartPositions).length > 0) {
    const currentNumber = Object.keys(knownStartPositions)[0];
    let currentPossiblePositions: Position[] = [knownStartPositions[currentNumber]];
    let visited: Position[] = [knownStartPositions[currentNumber]]
    delete knownStartPositions[currentNumber];
    let moves = 0;

    while (currentPossiblePositions.length > 0) {
      let newPossiblePositions: Position[] = [];
      moves++;
      for (let position of currentPossiblePositions) {
        const possibleNeighbours = getPossibleNeighbours(position, map[0].length, map.length).filter(possible => visited.every(visitedPos => visitedPos.x !== possible.x || visitedPos.y !== possible.y));
        for (let possiblePos of possibleNeighbours) {
          if (map[possiblePos.y][possiblePos.x] !== "#") {
            newPossiblePositions.push(possiblePos);

            if (map[possiblePos.y][possiblePos.x] !== ".") {
              if(movesToNumber[currentNumber] === undefined) {
                movesToNumber[currentNumber] = new Map<number, number>();
              }

              movesToNumber[currentNumber][parseInt(map[possiblePos.y][possiblePos.x])] = moves;
              if(movesToNumber[parseInt(map[possiblePos.y][possiblePos.x])] === undefined) {
                knownStartPositions[parseInt(map[possiblePos.y][possiblePos.x])] = possiblePos;
              }
            }
          }
          visited.push(possiblePos)
        }
      }
      currentPossiblePositions = newPossiblePositions;
    }
  }

  const numbers = Object.keys(movesToNumber).map(key => parseInt(key));
  const permutations = permute(numbers).filter(permutation => permutation[0] === 0);

  return permutations.map(permutation => {
    let moves = 0;

    for(let i = 0; i < permutation.length - 1; i++) {
      moves += movesToNumber[permutation[i]][permutation[i + 1]];
    }

    return moves;
  }).sort((a, b) => a - b)[0];
}

const goB = (input) => {
  const map: string[][] = splitToLines(input).map(line => line.split(""));

  let startPosition;

  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[y].length; x++) {
      if(map[y][x] === "0") {
        startPosition = {
          x: x,
          y: y
        }
      }
    }
  }

  const movesToNumber: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
  let knownStartPositions: Map<number, Position> = new Map<number, Position>();
  knownStartPositions[0] = startPosition;

  while(Object.keys(knownStartPositions).length > 0) {
    const currentNumber = Object.keys(knownStartPositions)[0];
    let currentPossiblePositions: Position[] = [knownStartPositions[currentNumber]];
    let visited: Position[] = [knownStartPositions[currentNumber]]
    delete knownStartPositions[currentNumber];
    let moves = 0;

    while (currentPossiblePositions.length > 0) {
      let newPossiblePositions: Position[] = [];
      moves++;
      for (let position of currentPossiblePositions) {
        const possibleNeighbours = getPossibleNeighbours(position, map[0].length, map.length).filter(possible => visited.every(visitedPos => visitedPos.x !== possible.x || visitedPos.y !== possible.y));
        for (let possiblePos of possibleNeighbours) {
          if (map[possiblePos.y][possiblePos.x] !== "#") {
            newPossiblePositions.push(possiblePos);

            if (map[possiblePos.y][possiblePos.x] !== ".") {
              if(movesToNumber[currentNumber] === undefined) {
                movesToNumber[currentNumber] = new Map<number, number>();
              }

              movesToNumber[currentNumber][parseInt(map[possiblePos.y][possiblePos.x])] = moves;
              if(movesToNumber[parseInt(map[possiblePos.y][possiblePos.x])] === undefined) {
                knownStartPositions[parseInt(map[possiblePos.y][possiblePos.x])] = possiblePos;
              }
            }
          }
          visited.push(possiblePos)
        }
      }
      currentPossiblePositions = newPossiblePositions;
    }
  }

  const numbers = Object.keys(movesToNumber).map(key => parseInt(key));
  const permutations = permute(numbers).filter(permutation => permutation[0] === 0).map(permutation => {permutation.push(0); return permutation});

  return permutations.map(permutation => {
    let moves = 0;

    for(let i = 0; i < permutation.length - 1; i++) {
      moves += movesToNumber[permutation[i]][permutation[i + 1]];
    }

    return moves;
  }).sort((a, b) => a - b)[0];
}

/* Tests */

test(goA(readTestFile()), 14)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
