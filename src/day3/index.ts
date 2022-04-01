import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const isTrianglePossible = (triangle: number[]): boolean => {
  return triangle[0] + triangle[1] > triangle[2] && triangle[0] + triangle[2] > triangle[1] && triangle[1] + triangle[2] > triangle[0]
}

const goA = (input) => {
  const triangleLines = splitToLines(input);
  const triangles: number[][] = triangleLines.map(line => line.trim().split(" ").filter(part => part.length > 0).map(part => parseInt(part.trim())));

  let possibleTriangles = 0;

  for(let triangle of triangles) {
    if(isTrianglePossible(triangle)) {
      possibleTriangles++;
    }
  }

  return possibleTriangles
}

const goB = (input) => {
  const triangleLines = splitToLines(input);
  const triangles: number[][] = [];

  let triangle1: number[] = [];
  let triangle2: number[] = [];
  let triangle3: number[] = [];
  for(let i = 0; i < triangleLines.length; i++){
    const triangleParts: number[] = triangleLines[i].split(" ").filter(part => part.length > 0).map(part => parseInt(part.trim()));
    triangle1.push(triangleParts[0]);
    triangle2.push(triangleParts[1]);
    triangle3.push(triangleParts[2]);

    if(triangle1.length === 3) {
      triangles.push(triangle1, triangle2, triangle3);
      triangle1 = [];
      triangle2 = [];
      triangle3 = [];
    }
  }

  let possibleTriangles = 0;

  for(let triangle of triangles) {
    if(isTrianglePossible(triangle)) {
      possibleTriangles++;
    }
  }

  return possibleTriangles
}

/* Tests */

test(isTrianglePossible([5, 10, 25]), false)
test(isTrianglePossible([3, 3, 5]), true)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
