import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Bot {
  id: number
  storedChips: number[];
  lowBot?: number;
  highBot?: number;
  lowOutput?: number;
  highOutput?: number;
}

const parseInput = (input: string[]): Record<number, Bot> => {
  const bots: Record<number, Bot> = {};

  for(let line of input) {
    const split = line.trim().split(" ");
    if(line.startsWith("value")) {
      const chip = parseInt(split[1].trim());
      const bot = parseInt(split[split.length - 1].trim());

      if(!bots[bot]) {
        bots[bot] = {
          id: bot,
          storedChips: [],
        }
      }

      bots[bot].storedChips.push(chip);
    } else {
      const bot = parseInt(split[1].trim());
      const low = parseInt(split[6].trim());
      const high = parseInt(split[split.length - 1].trim());
      const lowOutput = split[5].trim() === "output";
      const highOutput = split[split.length - 2].trim() === "output";

      if(!bots[bot]) {
        bots[bot] = {
          id: bot,
          storedChips: [],
        }
      }

      if(lowOutput) {
        bots[bot].lowOutput = low;
      } else {
        bots[bot].lowBot = low;

        if(!bots[low]) {
          bots[low] = {
            id: low,
            storedChips: [],
          }
        }
      }

      if(highOutput) {
        bots[bot].highOutput = high;
      } else {
        bots[bot].highBot = high;

        if(!bots[high]) {
          bots[high] = {
            id: high,
            storedChips: [],
          }
        }
      }
    }
  }

  return bots;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const bots: Record<number, Bot> = parseInput(lines);
  const outputs: Record<number, number[]> = {};

  let botComparing61And17 = -1;

  let botsWithTwoChips = Object.values(bots).filter(bot => bot.storedChips.length === 2).map(bot => bot.id);

  while(botsWithTwoChips.length > 0) {
    const chips = bots[botsWithTwoChips[0]].storedChips.sort((a, b) => a - b);
    bots[botsWithTwoChips[0]].storedChips = [];

    if(chips.includes(17) && chips.includes(61)) {
      botComparing61And17 = botsWithTwoChips[0];
    }

    if(bots[botsWithTwoChips[0]].lowOutput !== undefined) {
      if(!outputs[bots[botsWithTwoChips[0]].lowOutput]) {
        outputs[bots[botsWithTwoChips[0]].lowOutput] = [];
      }

      outputs[bots[botsWithTwoChips[0]].lowOutput].push(chips[0]);
    } else {
      bots[bots[botsWithTwoChips[0]].lowBot].storedChips.push(chips[0])

      if(bots[bots[botsWithTwoChips[0]].lowBot].storedChips.length === 2) {
        botsWithTwoChips.push(bots[botsWithTwoChips[0]].lowBot)
      }
    }

    if(bots[botsWithTwoChips[0]].highOutput !== undefined) {
      if(!outputs[bots[botsWithTwoChips[0]].highOutput]) {
        outputs[bots[botsWithTwoChips[0]].highOutput] = [];
      }

      outputs[bots[botsWithTwoChips[0]].highOutput].push(chips[1]);
    } else {
      bots[bots[botsWithTwoChips[0]].highBot].storedChips.push(chips[1])

      if(bots[bots[botsWithTwoChips[0]].highBot].storedChips.length === 2) {
        botsWithTwoChips.push(bots[botsWithTwoChips[0]].highBot)
      }
    }

    botsWithTwoChips.splice(0, 1);
  }

  return botComparing61And17;
}

const goB = (input) => {
  const lines = splitToLines(input);
  const bots: Record<number, Bot> = parseInput(lines);
  const outputs: Record<number, number[]> = {};

  let botsWithTwoChips = Object.values(bots).filter(bot => bot.storedChips.length === 2).map(bot => bot.id);

  while(botsWithTwoChips.length > 0) {
    const chips = bots[botsWithTwoChips[0]].storedChips.sort((a, b) => a - b);
    bots[botsWithTwoChips[0]].storedChips = [];

    if(bots[botsWithTwoChips[0]].lowOutput !== undefined) {
      if(!outputs[bots[botsWithTwoChips[0]].lowOutput]) {
        outputs[bots[botsWithTwoChips[0]].lowOutput] = [];
      }

      outputs[bots[botsWithTwoChips[0]].lowOutput].push(chips[0]);
    } else {
      bots[bots[botsWithTwoChips[0]].lowBot].storedChips.push(chips[0])

      if(bots[bots[botsWithTwoChips[0]].lowBot].storedChips.length === 2) {
        botsWithTwoChips.push(bots[botsWithTwoChips[0]].lowBot)
      }
    }

    if(bots[botsWithTwoChips[0]].highOutput !== undefined) {
      if(!outputs[bots[botsWithTwoChips[0]].highOutput]) {
        outputs[bots[botsWithTwoChips[0]].highOutput] = [];
      }

      outputs[bots[botsWithTwoChips[0]].highOutput].push(chips[1]);
    } else {
      bots[bots[botsWithTwoChips[0]].highBot].storedChips.push(chips[1])

      if(bots[bots[botsWithTwoChips[0]].highBot].storedChips.length === 2) {
        botsWithTwoChips.push(bots[botsWithTwoChips[0]].highBot)
      }
    }

    botsWithTwoChips.splice(0, 1);
  }

  return outputs[0][0] * outputs[1][0] * outputs[2][0]
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
