import { test, readInput } from "../utils/index"
import { encrypt } from "../utils/md5"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const threeSameCharactersInARow = (hash: string): string | undefined => {
  for(let i = 0; i < hash.length + 2; i++) {
    if(hash.charAt(i) !== "" && hash.charAt(i) === hash.charAt(i + 1) && hash.charAt(i) === hash.charAt(i + 2)) {
      return hash.charAt(i);
    }
  }
  return undefined;
}

const fiveSameCharactersInARow = (hash: string): string[] => {
  const fiveSameCharacters: string[] = [];

  for(let i = 0; i < hash.length + 4; i++) {
    if(hash.charAt(i) !== "" && hash.charAt(i) === hash.charAt(i + 1) && hash.charAt(i) === hash.charAt(i + 2) && hash.charAt(i) === hash.charAt(i + 3) && hash.charAt(i) === hash.charAt(i + 4) && !fiveSameCharacters.includes(hash.charAt(i))) {
      fiveSameCharacters.push(hash.charAt(i))
    }
  }
  return fiveSameCharacters;
}

const goA = (input) => {
  const salt = input.trim();

  let keys: number[] = [];
  let maybeKeys: Map<string, number[]> = new Map<string, number[]>();
  let index = 0;

  // Running for some more Keys to ensure that all relevant Keys have a chance to generate another 1000 Hashed to be proved
  while(keys.length < 75) {
    const hash = encrypt(salt + index);

    const fiveCharsInRow = fiveSameCharactersInARow(hash);

    if(fiveCharsInRow.length > 0) {
      for(let char of fiveCharsInRow) {
        if(maybeKeys[char] !== undefined) {
          const indices = maybeKeys[char];

          for(let oldIndex of indices) {
            if(index - oldIndex <= 1000) {
              keys.push(oldIndex);
            }
          }
          maybeKeys[char] = [];
        }
      }
    }

    const tripletChar = threeSameCharactersInARow(hash);
    if(tripletChar !== undefined) {
      if(maybeKeys[tripletChar] === undefined) {
        maybeKeys[tripletChar] = []
      }

      maybeKeys[tripletChar].push(index);
    }

    index++;
  }

  keys = keys.sort((a, b) => a - b);

  return keys[63];
}

const goB = (input) => {
  const salt = input.trim();

  let keys: number[] = [];
  let maybeKeys: Map<string, number[]> = new Map<string, number[]>();
  let index = 0;

  // Running for some more Keys to ensure that all relevant Keys have a chance to generate another 1000 Hashed to be proved
  while(keys.length < 75) {
    let hash = encrypt(salt + index);

    for(let i = 0; i < 2016; i++) {
      hash = encrypt(hash);
    }

    const fiveCharsInRow = fiveSameCharactersInARow(hash);

    if(fiveCharsInRow.length > 0) {
      for(let char of fiveCharsInRow) {
        if(maybeKeys[char] !== undefined) {
          const indices = maybeKeys[char];

          for(let oldIndex of indices) {
            if(index - oldIndex <= 1000) {
              keys.push(oldIndex);
            }
          }
          maybeKeys[char] = [];
        }
      }
    }

    const tripletChar = threeSameCharactersInARow(hash);
    if(tripletChar !== undefined) {
      if(maybeKeys[tripletChar] === undefined) {
        maybeKeys[tripletChar] = []
      }

      maybeKeys[tripletChar].push(index);
    }

    index++;
  }

  keys = keys.sort((a, b) => a - b);

  return keys[63];
}

/* Tests */

test(goA("abc"), 22728)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
