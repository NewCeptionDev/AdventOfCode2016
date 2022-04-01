import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const supportsTLS = (ip: string): boolean => {
  let hasABBA = false

  let a = ""
  let hypernetSequence = false
  for (let i = 0; i < ip.length - 2; i++) {
    if (ip.charAt(i) === "[") {
      hypernetSequence = true
    } else if (ip.charAt(i) === "]") {
      hypernetSequence = false
    }

    if (!a || a === ip.charAt(i)) {
      a = ip.charAt(i)
    } else if (ip.charAt(i + 1) === ip.charAt(i) && ip.charAt(i + 2) === a) {
      if (hypernetSequence) {
        return false
      } else {
        hasABBA = true
      }
    } else {
      a = ip.charAt(i)
    }
  }

  return hasABBA
}

const supportsSSL = (ip: string): boolean => {
  const foundABAs: string[] = [];
  const foundBABs: string[] = [];

  let a = ""
  let hypernetSequence = false
  for (let i = 0; i < ip.length - 1; i++) {
    if (ip.charAt(i) === "[") {
      hypernetSequence = true;
      a = "";
    } else if (ip.charAt(i) === "]") {
      hypernetSequence = false;
      a = "";
    } else {
      if (!a || a === ip.charAt(i)) {
        a = ip.charAt(i)
      } else if (ip.charAt(i + 1) === a) {
        if(hypernetSequence) {
          if(foundABAs.find(aba => ip.charAt(i - 1) === aba.charAt(1) && ip.charAt(i) === aba.charAt(0) && ip.charAt(i + 1) === aba.charAt(1))) {
            return true;
          }
          foundBABs.push(ip.substr(i - 1, 3));
        } else {
          if(foundBABs.find(bab => ip.charAt(i - 1) === bab.charAt(1) && ip.charAt(i) === bab.charAt(0) && ip.charAt(i + 1) === bab.charAt(1))) {
            return true;
          }
          foundABAs.push(ip.substr(i - 1, 3));
        }
        a = ip.charAt(i);
      } else {
        a = ip.charAt(i)
      }
    }
  }

  return false
}

const goA = (input) => {
  const lines = splitToLines(input)

  return lines.filter(line => supportsTLS(line)).length
}

const goB = (input) => {
  const lines = splitToLines(input)

  return lines.filter(line => supportsSSL(line)).length
}

/* Tests */

test(supportsTLS("abba[mnop]qrst"), true)
test(supportsTLS("abcd[bddb]xyyx"), false)
test(supportsTLS("aaaa[qwer]tyui"), false)
test(supportsTLS("ioxxoj[asdfgh]zxcvbn"), true)
test(supportsSSL("aba[bab]xyz"), true)
test(supportsSSL("xyx[xyx]xyx"), false)
test(supportsSSL("aaa[kek]eke"), true)
test(supportsSSL("zazbz[bzb]cdb"), true)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
