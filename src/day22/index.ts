import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Node {
  x: number;
  y: number;
  maxSize: number;
  used: number;
}

const parseNode = (line: string): Node => {
  const split = line.split(" ").filter(splitted => splitted !== "");
  const nameSplit = split[0].split("-");

  return {
    x: parseInt(nameSplit[1].substring(1)),
    y: parseInt(nameSplit[2].substring(1)),
    maxSize: parseInt(split[1].substring(0, split[1].length - 1)),
    used: parseInt(split[2].substring(0, split[1].length - 1))
  }
}

const goA = (input) => {
  const lines = splitToLines(input);
  //Remove first two lines as they do not follow the scheme and do not contain relevant information
  lines.splice(0, 2);
  const nodes = lines.map(line => parseNode(line));

  let viablePairs = 0;

  for(let node1 of nodes) {
    for(let node2 of nodes) {
      if((node1.x !== node2.x || node1.y !== node2.y) && node1.used > 0 && node1.used + node2.used <= node2.maxSize) {
        viablePairs++;
      }
    }
  }

  return viablePairs
}

const goB = (input) => {
  const lines = splitToLines(input);
  //Remove first two lines as they do not follow the scheme and do not contain relevant information
  lines.splice(0, 2);
  const nodes = lines.map(line => parseNode(line));

  const nodeMap: Map<number, Map<number, Node>> = new Map<number, Map<number, Node>>();

  for(let node of nodes) {
    if(nodeMap[node.y] === undefined) {
      nodeMap[node.y] = new Map<number, Node>();
    }
    nodeMap[node.y][node.x] = node;
  }

  const stringRepresentations: string[] = [];

  for(let y of Object.keys(nodeMap)) {
    stringRepresentations.push((Object.keys(nodeMap[y]).map(x => nodeMap[y][x]).map(node => {
      const usedPercentage = node.used / node.maxSize;

      if(node.maxSize > 200) {
        return "#";
      } else if(usedPercentage > 0.5){
        return ".";
      } else {
        return "_";
      }
    }).join("")));
  }

  // Printed Node Map to have an Idea how to solve this mathematically
  // console.log(stringRepresentations)

  // Those numbers are hand counted from the printed Map
  const freeNodeX = 3;
  const freeNodeY = 28;

  // I know that for me to move the free Space to the top row I just need to move it to the left and then up
  const neededMoves = freeNodeX + freeNodeY;

  // Maximum X, Needed Data is at maxX and y = 0
  const maxX = 32;

  // To move the Needed Data by one to the left we need 5 Moves to we can calculate the fully needed amount
  return neededMoves + maxX + (maxX - 1) * 5;
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
