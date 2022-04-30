import { test, readInput } from "../utils/index"
import { readTestFile, splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Range {
  start: number;
  end: number;
}

const parseRange = (line: string): Range => {
  const split = line.split("-");
  return {
    start: parseInt(split[0].trim()),
    end: parseInt(split[1].trim())
  }
}

const mergeRanges = (ranges: Range[]): Range[] => {
  let mergedRanges: Range[] = []

  for(let i = 0; i < ranges.length; i++) {
    if(i === ranges.length - 1){
      mergedRanges.push(ranges[i]);
      continue;
    }

    if(ranges[i].start < ranges[i + 1].start) {
      if(ranges[i].end + 1 >= ranges[i + 1].start) {
        if(ranges[i].end >= ranges[i + 1].end) {
          mergedRanges.push(ranges[i]);
          i++;
        } else {
          mergedRanges.push({
            start: ranges[i].start,
            end: ranges[i+1].end
          });
          i++;
        }
      } else {
        mergedRanges.push(ranges[i]);
      }
    }
  }

  return mergedRanges;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const ranges: Range[] = lines.map(line => parseRange(line));

  let checkingIp = 0;
  for(let i = 0; i < ranges.length; i++) {
    if(checkingIp >= ranges[i].start && checkingIp <= ranges[i].end) {
      checkingIp = ranges[i].end + 1;
      i = 0;
    }
  }

  return checkingIp
}

const goB = (input) => {
  const lines = splitToLines(input);
  let ranges: Range[] = lines.map(line => parseRange(line));
  ranges = ranges.sort((a, b) => a.start - b.start);

  let mergedRanges = mergeRanges(ranges);

  while (ranges.length !== mergedRanges.length) {
    ranges = mergedRanges;
    mergedRanges = mergeRanges(ranges);
  }

  ranges = ranges.sort((a, b) => a.start - b.start);

  let allowedIps = 0;

  // I know that 0 is Blacklisted and the last Range goes over the maximum allowed Value, so I don't have to consider these edge cases here
  for(let i = 0; i < ranges.length - 1; i++){
    allowedIps += ranges[i + 1].start - ranges[i].end - 1;
  }


  return allowedIps
}

/* Tests */

test(goA(readTestFile()), 3)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
