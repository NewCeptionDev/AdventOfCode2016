import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Position {
  x: number;
  y: number;
}

const countOfOneBits = (binary: string): number => {
  let count = 0

  for (let i = 0; i < binary.length; i++) {
    if (binary.charAt(i) === "1") {
      count++
    }
  }

  return count
}

const isPositionAWall = (x: number, y: number, favNumber: number): boolean => {
  const binRep = (x * x + 3 * x + 2 * x * y + y + y * y + favNumber).toString(2)

  return countOfOneBits(binRep) % 2 !== 0
}

const getAllPossibleNewPositions = (position: Position): Position[] => {
  return [{
    x: position.x + 1,
    y: position.y,
  }, {
    x: position.x - 1,
    y: position.y,
  }, {
    x: position.x,
    y: position.y - 1,
  }, {
    x: position.x,
    y: position.y + 1,
  }]
}

const goA = (input, goalX: number, goalY: number) => {
  const favNumber = parseInt(input.trim())

  const calculatedWalls: Map<number, Map<number, boolean>> = new Map<number, Map<number, boolean>>()

  // Start Place is not a Wall
  calculatedWalls[1] = new Map<number, boolean>()
  calculatedWalls[1][1] = false

  const visitedSpaces: Map<number, Map<number, boolean>> = new Map<number, Map<number, boolean>>()

  // Start Place is visited
  visitedSpaces[1] = new Map<number, boolean>()
  visitedSpaces[1][1] = true

  let possibleCurrentPositions: Position[] = [{ x: 1, y: 1 }]
  let possibleNextPositions: Position[] = []
  let steps = 0

  while (!possibleCurrentPositions.find(position => position.x === goalX && position.y === goalY)) {
    const currentPosition = possibleCurrentPositions.pop()

    const possibleNewPositions = getAllPossibleNewPositions(currentPosition)
      .filter(position => position.x >= 0 && position.y >= 0)
      .filter(position => visitedSpaces[position.y] === undefined || visitedSpaces[position.y][position.x] === undefined)
      .filter(position => {
        const isWall = calculatedWalls[position.y] && calculatedWalls[position.y][position.x]

        if (isWall !== undefined) {
          return !isWall
        } else {
          const calculatedWall = isPositionAWall(position.x, position.y, favNumber)

          if (!calculatedWalls[position.y]) {
            calculatedWalls[position.y] = new Map<number, boolean>()
          }

          calculatedWalls[position.y][position.x] = calculatedWall
          return !calculatedWall
        }
      })

    for (let position of possibleNewPositions) {
      if (!visitedSpaces[position.y]) {
        visitedSpaces[position.y] = new Map<number, boolean>()
      }

      visitedSpaces[position.y][position.x] = true
    }
    possibleNextPositions.push(...possibleNewPositions)

    if (possibleCurrentPositions.length === 0) {
      possibleCurrentPositions = possibleNextPositions
      possibleNextPositions = [];
      steps++;
    }
  }

  return steps
}

const goB = (input) => {
  const favNumber = parseInt(input.trim())

  const calculatedWalls: Map<number, Map<number, boolean>> = new Map<number, Map<number, boolean>>()

  // Start Place is not a Wall
  calculatedWalls[1] = new Map<number, boolean>()
  calculatedWalls[1][1] = false

  const visitedSpaces: Map<number, Map<number, boolean>> = new Map<number, Map<number, boolean>>()

  // Start Place is visited
  visitedSpaces[1] = new Map<number, boolean>()
  visitedSpaces[1][1] = true

  let possibleCurrentPositions: Position[] = [{ x: 1, y: 1 }]
  let possibleNextPositions: Position[] = []
  let steps = 0

  while (steps < 50) {
    const currentPosition = possibleCurrentPositions.pop()

    const possibleNewPositions = getAllPossibleNewPositions(currentPosition)
      .filter(position => position.x >= 0 && position.y >= 0)
      .filter(position => visitedSpaces[position.y] === undefined || visitedSpaces[position.y][position.x] === undefined)
      .filter(position => {
        const isWall = calculatedWalls[position.y] && calculatedWalls[position.y][position.x]

        if (isWall !== undefined) {
          return !isWall
        } else {
          const calculatedWall = isPositionAWall(position.x, position.y, favNumber)

          if (!calculatedWalls[position.y]) {
            calculatedWalls[position.y] = new Map<number, boolean>()
          }

          calculatedWalls[position.y][position.x] = calculatedWall
          return !calculatedWall
        }
      })

    for (let position of possibleNewPositions) {
      if (!visitedSpaces[position.y]) {
        visitedSpaces[position.y] = new Map<number, boolean>()
      }

      visitedSpaces[position.y][position.x] = true
    }
    possibleNextPositions.push(...possibleNewPositions)

    if (possibleCurrentPositions.length === 0) {
      possibleCurrentPositions = possibleNextPositions
      possibleNextPositions = [];
      steps++;
    }
  }

  let visitedPlaces = 0;

  for(let yPosition of Object.keys(visitedSpaces)) {
    visitedPlaces += Object.keys(visitedSpaces[yPosition]).length;
  }

  return visitedPlaces
}

/* Tests */

test(isPositionAWall(1, 0, 10), true)
test(isPositionAWall(0, 0, 10), false)
test(isPositionAWall(0, 1, 10), false)
test(isPositionAWall(1, 1, 10), false)
test(isPositionAWall(0, 2, 10), true)
test(isPositionAWall(2, 1, 10), true)
test(isPositionAWall(3, 0, 10), true)
test(goA("10", 7, 4), 11)

/* Results */

console.time("Time")
const resultA = goA(input, 31, 39)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
