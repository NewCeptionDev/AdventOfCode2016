import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum DIRECTION {
  North,
  East,
  South,
  West
}

interface Position {
  x: number;
  y: number;
}

const turnLeft = (direction: DIRECTION): DIRECTION => {
  return direction === 0 ? 3 : direction - 1
}

const turnRight = (direction: DIRECTION): DIRECTION => {
  return direction === 3 ? 0 : direction + 1
}

const getNewDirection = (instruction: string, direction: DIRECTION): DIRECTION => {
  switch (instruction[0]) {
    case "L":
      return  turnLeft(direction)
    case "R":
      return  turnRight(direction)
    default:
      console.error("Bad Input Parsing")
  }
}

const moveToNewPosition = (position: Position, direction: DIRECTION, instruction: string): Position[] => {
  const visitedPositions: Position[] = [];

  const movement = parseInt(instruction.substr(1))

  switch (direction) {
    case DIRECTION.North:
      for(let i = 1; i <= movement; i++){
        visitedPositions.push({
          x: position.x,
          y: position.y + i
        })
      }
      break
    case DIRECTION.East:
      for(let i = 1; i <= movement; i++) {
        visitedPositions.push({
          x: position.x + i,
          y: position.y
        })
      }
      break
    case DIRECTION.South:
        for(let i = 1; i <= movement; i++) {
          visitedPositions.push({
            x: position.x,
            y: position.y - i,
          })
        }
      break
    case DIRECTION.West:
          for(let i = 1; i <= movement; i++) {
            visitedPositions.push({
              x: position.x - i,
              y: position.y
            })
          }
      break
  }

  return visitedPositions
}

const goA = (input) => {
  const instructions = input.trim().split(", ")

  let position: Position = {x: 0, y: 0}
  let direction = DIRECTION.North

  for (let instruction of instructions) {
    direction = getNewDirection(instruction, direction);
    position = moveToNewPosition(position, direction, instruction).pop();
  }

  return Math.abs(position.x) + Math.abs(position.y)
}

const goB = (input) => {
  const instructions = input.trim().split(", ")

  const visitedPositions: Record<number, number[]> = {}
  visitedPositions[0] = [0]

  let position: Position = {x: 0, y: 0}
  let direction = DIRECTION.North

  for (let instruction of instructions) {
    direction = getNewDirection(instruction, direction);
    const positions = moveToNewPosition(position, direction, instruction);

    for(let visited of positions){
      if(visitedPositions[visited.y] && visitedPositions[visited.y].includes(visited.x)) {
        return Math.abs(visited.x) + Math.abs(visited.y)
      }

      if(!visitedPositions[visited.y]) {
        visitedPositions[visited.y] = []
      }

      visitedPositions[visited.y].push(visited.x);
    }

    position = positions.pop();
  }

  return "Error"
}

/* Tests */

test(goB("R8, R4, R4, R8"), 4)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
