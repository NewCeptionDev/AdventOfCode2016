import { test, readInput } from "../utils/index"
import * as crypto from 'crypto';

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

export const md5 = (contents: string) => {
  return crypto.createHash('md5').update(contents).digest("hex");
}

const goA = (input) => {
  const doorId = input.trim();

  let password = "";

  let currentIndex = 1;
  while(password.length < 8) {
    const newHash = md5(doorId + currentIndex);

    if(newHash.startsWith("00000")) {
      password += newHash.charAt(5);
    }
    currentIndex++;
  }

  return password
}

const goB = (input) => {
  const doorId = input.trim();

  let password: string[] = ["","", "", "", "", "", "", ""];

  let currentIndex = 1;
  while(password.filter(elem => elem.length > 0).length < 8) {
    const newHash = md5(doorId + currentIndex);

    if(newHash.startsWith("00000")) {
      const index = parseInt(newHash.charAt(5));
      if(index !== undefined && password[index] === "") {
        password[index] = newHash.charAt(6)
      }
    }
    currentIndex++;
  }

  return password.reduce((previousValue, currentValue) => previousValue + currentValue)
}

/* Tests */

test(goA("abc"), "18f47a30")
test(goB("abc"), "05ace8e3")

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
