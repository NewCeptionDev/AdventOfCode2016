import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Room {
  encryptedName: string;
  charsByOccurrence: Record<number, string[]>;
  sectorId: number;
  checksum: string;
}

const parseRoom = (line: string): Room => {
  const parts = line.split("-");
  const sectorAndChecksum = parts.pop();

  const nameParts: Record<string, number> = {};

  for(let i = 0; i < parts.length; i++){
    for(let j = 0; j < parts[i].length; j++) {
      if(!nameParts[parts[i].charAt(j)]) {
        nameParts[parts[i].charAt(j)] = 0;
      }

      nameParts[parts[i].charAt(j)] = nameParts[parts[i].charAt(j)] + 1;
    }
  }

  const charsByOccurrence: Record<number, string[]> = {};

  for(let char of Object.keys(nameParts)) {
    const occurrenceCount = nameParts[char];

    if(!charsByOccurrence[occurrenceCount]) {
      charsByOccurrence[occurrenceCount] = [];
    }

    charsByOccurrence[occurrenceCount].push(char);
  }

  return {
    encryptedName: parts.reduce((previousValue, currentValue) => previousValue + " " + currentValue),
    charsByOccurrence: charsByOccurrence,
    sectorId: parseInt(sectorAndChecksum.substring(0, sectorAndChecksum.indexOf("["))),
    checksum: sectorAndChecksum.substring(sectorAndChecksum.indexOf("[") + 1, sectorAndChecksum.length - 1)
  }
}

const getCalculatedChecksum = (room: Room): string => {
  let checksum = "";

  const keys = Object.keys(room.charsByOccurrence).map(key => parseInt(key)).sort((a, b) => b - a);

  for(let i = 0; i < keys.length && checksum.length < 5; i++) {
    const charsAtLength = room.charsByOccurrence[keys[i]].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));

    for(let char of charsAtLength) {
      if(checksum.length < 5) {
        checksum += char;
      }
    }
  }

  return checksum;
}

const isRoomReal = (room: Room): boolean => {
  return room.checksum === getCalculatedChecksum(room);
}

const getDecryptedLetter = (startLetter: string, rounds: number) => {
  const letterMove = rounds % 26;
  const zCode = "z".charCodeAt(0);

  let newLetterCode = startLetter.charCodeAt(0) + letterMove;

  if(newLetterCode > zCode) {
    newLetterCode -= 26;
  }

  return String.fromCharCode(newLetterCode);
}

const decryptRoomName = (room: Room): string => {
  const rounds = room.sectorId;
  let decryptedName = "";

  for(let i = 0; i < room.encryptedName.length; i++) {
    if(room.encryptedName.charAt(i) === " ") {
      decryptedName += " ";
    } else {
      decryptedName += getDecryptedLetter(room.encryptedName.charAt(i), rounds);
    }
  }

  return decryptedName;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const rooms: Room[] = lines.map(line => parseRoom(line));

  return rooms.filter(room => isRoomReal(room)).map(room => room.sectorId).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
}

const goB = (input) => {
  const lines = splitToLines(input);
  const rooms: Room[] = lines.map(line => parseRoom(line)).filter(room => isRoomReal(room));

  return rooms.find(room => decryptRoomName(room) === "northpole object storage").sectorId
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
