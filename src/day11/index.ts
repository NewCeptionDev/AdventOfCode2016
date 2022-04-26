import { test, readInput } from "../utils/index"
import { splitToLines } from "../utils/readInput"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

/**
 * For every Floor first Char is Elevator, then repeating Generator of a kind followed by Microchip of that kind
 * 1 if present, 0 if not present
 *
 * Floors are counted from top to bottom
 */
interface State {
  floor1: string;
  floor2: string;
  floor3: string;
  floor4: string;
}

const stateToString = (state: State): string => {
  return state.floor1 + "|" + state.floor2 + "|" + state.floor3 + "|" + state.floor4
}

const stringToState = (string: string): State => {
  const splits = string.split("|")

  return {
    floor1: splits[0],
    floor2: splits[1],
    floor3: splits[2],
    floor4: splits[3],
  }
}

const getElevatorFloor = (state: State): number => {
  return state.floor1.startsWith("1") ? 4 : state.floor2.startsWith("1") ? 3 : state.floor3.startsWith("1") ? 2 : 1
}

const getFloorWithNumber = (state: State, floorNumber: number) => {
  switch (floorNumber) {
    case 1:
      return state.floor4
    case 2:
      return state.floor3
    case 3:
      return state.floor2
    case 4:
      return state.floor1
  }
}

const isStatePossible = (state: State): boolean => {
  return isFloorPossible(state.floor1) && isFloorPossible(state.floor2) && isFloorPossible(state.floor3) && isFloorPossible(state.floor4)
}

const isFloorPossible = (floor: string): boolean => {
  const generatorsOnFloor: number[] = []
  const chipsOnFloor: number[] = []

  for (let i = 1; i < floor.length; i++) {
    if (floor.charAt(i) === "1") {
      if (i % 2 === 0) {
        chipsOnFloor.push(i)
      } else {
        generatorsOnFloor.push(i)
      }
    }
  }

  return chipsOnFloor.map(chip => generatorsOnFloor.includes(chip - 1)).reduce((previousValue, currentValue) => previousValue && currentValue, true) || chipsOnFloor.length === 0 || generatorsOnFloor.length === 0;
}

const calculateNextStatesBasedOnCurrentState = (state: State): string[] => {
  const currentElevatorFloor = getElevatorFloor(state);
  const possibleNewElevatorFloors: number[] = [];
  const newStates: string[] = [];


  if(currentElevatorFloor > 1){
    possibleNewElevatorFloors.push(currentElevatorFloor - 1);
  }

  if(currentElevatorFloor < 4) {
    possibleNewElevatorFloors.push(currentElevatorFloor + 1);
  }

  const currentFloor = getFloorWithNumber(state, currentElevatorFloor);

  for(let i = 1; i < currentFloor.length; i++) {
    if(currentFloor.charAt(i) === "1") {
      possibleNewElevatorFloors.forEach(newFloor => {
        const newState = buildNewState(buildNewState(state, i, currentElevatorFloor, newFloor), 0, currentElevatorFloor, newFloor);

        if(isStatePossible(newState) && !newStates.includes(stateToString(newState))){
          newStates.push(stateToString(newState));
        }
      })
    }
  }

  for(let i = 1; i < currentFloor.length - 1; i++) {
    for(let j = i + 1; j < currentFloor.length; j++) {
      if(currentFloor.charAt(i) === "1" && currentFloor.charAt(j) === "1") {
        // Check if both Chips or generators or if it is a chip and generator that belong to each other
        if(i % 2 === j % 2 || (i % 2 !== 0 && i + 1 === j)) {
          possibleNewElevatorFloors.forEach(newFloor => {
            const newState = buildNewState(buildNewState(buildNewState(state, i, currentElevatorFloor, newFloor), 0, currentElevatorFloor, newFloor), j, currentElevatorFloor, newFloor);

            if(isStatePossible(newState) && !newStates.includes(stateToString(newState))){
              newStates.push(stateToString(newState));
            }
          })
        }
      }
    }
  }
  return newStates;
}

const buildNewState = (currentState: State, index: number, oldFloor: number, newFloor: number): State => {
  return {
    floor1: oldFloor === 4 ? currentState.floor1.substring(0, index) + "0" + currentState.floor1.substring(index + 1, currentState.floor1.length) : newFloor === 4 ? currentState.floor1.substring(0, index) + "1" + currentState.floor1.substring(index + 1, currentState.floor1.length) : currentState.floor1,
    floor2: oldFloor === 3 ? currentState.floor2.substring(0, index) + "0" + currentState.floor2.substring(index + 1, currentState.floor2.length) : newFloor === 3 ? currentState.floor2.substring(0, index) + "1" + currentState.floor2.substring(index + 1, currentState.floor2.length) : currentState.floor2,
    floor3: oldFloor === 2 ? currentState.floor3.substring(0, index) + "0" + currentState.floor3.substring(index + 1, currentState.floor3.length) : newFloor === 2 ? currentState.floor3.substring(0, index) + "1" + currentState.floor3.substring(index + 1, currentState.floor3.length) : currentState.floor3,
    floor4: oldFloor === 1 ? currentState.floor4.substring(0, index) + "0" + currentState.floor4.substring(index + 1, currentState.floor4.length) : newFloor === 1 ? currentState.floor4.substring(0, index) + "1" + currentState.floor4.substring(index + 1, currentState.floor4.length) : currentState.floor4,
  }
}

const goA = (startState: State, searchedEndFloor: string) => {
  let states: State[] = [startState];
  let stepCount = 0;
  let usedStates: string[] = [];

  while(!states.find(state => stateToString(state).startsWith(searchedEndFloor))){
    const newStates: string[] = [];
    for(let state of states) {
      const calculated = calculateNextStatesBasedOnCurrentState(state);

      for(let calculatedState of calculated) {
        if(!newStates.includes(calculatedState) && !usedStates.includes(calculatedState)) {
          newStates.push(calculatedState);
        }
      }
    }

    usedStates.push(...states.map(state => stateToString(state)))
    states = newStates.map(stateString => stringToState(stateString));
    stepCount++;
    console.log(stepCount, states.length, usedStates.length)
  }

  return stepCount;
}

const goB = (startState: State, searchedEndFloor: string) => {
  return goA(startState, searchedEndFloor);
}

/* Tests */

test(goA({
  floor1: "00000",
  floor2: "00010",
  floor3: "01000",
  floor4: "10101"
}, "11111"), 11);

/* Results */

console.time("Time")
const resultA = goA({
  floor1: "00000000000",
  floor2: "00000010000",
  floor3: "00000101111",
  floor4: "11111000000",
}, "11111111111")
const resultB = goB({
  floor1: "000000000000000",
  floor2: "000000100000000",
  floor3: "000001011110000",
  floor4: "111110000001111",
}, "111111111111111")
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
