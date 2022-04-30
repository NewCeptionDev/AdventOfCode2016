import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Disk {
  id: number;
  position: number;
  maxPosition: number;
}

const parseDisk = (diskLine: string): Disk => {
  const split = diskLine.split(" ");

  return {
    id: parseInt(split[1].charAt(1)),
    position: parseInt(split[11]),
    maxPosition: parseInt(split[3])
  }
}

const passesAllDisks = (time: number, disks: Disk[]): boolean => {
  for(let disk of disks) {
    if((time + disk.id + disk.position) % disk.maxPosition !== 0){
      return false;
    }
  }

  return true;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const disks: Disk[] = lines.map(line => parseDisk(line));

  let time = 0;
  while(!passesAllDisks(time, disks)) {
    time++;
  }

  return time;
}

const goB = (input) => {
  const lines = splitToLines(input);
  const disks: Disk[] = lines.map(line => parseDisk(line));
  disks.push({
    id: 7,
    position: 0,
    maxPosition: 11
  })

  let time = 0;
  while(!passesAllDisks(time, disks)) {
    time++;
  }

  return time;
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
