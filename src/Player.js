import Gameboard from "./Gameboard";
import { isIn, getRandomInt, grid, isARealCell,  getShipSize, } from "./helpers";

export default function Player() {
  let gameboard = Gameboard();

  let toss = getRandomInt(2);
  let sunkList = [];

  const getPossibleTargets = (board) => {
    let possibles = grid.filter(
      (cell) => !isIn(cell, board.attackedLocations())
    );
    return possibles;
  };

  const attack = (board, cell) => {
    let attackResult = board.receiveAttack(cell); // attackResult = { message: string, sunkShipCoordinates: array | null }
    
    if (attackResult.sunkShipCoordinates) {
      // Concatenate new sunk coordinates, ensuring no duplicates if necessary,
      // though current logic for clues should handle it.
      // For simplicity, direct concat, assuming sunkShipCoordinates are unique and not already in sunkList.
      sunkList = sunkList.concat(attackResult.sunkShipCoordinates);
      // A more robust way to avoid duplicates if sunkShipCoordinates could overlap or repeat:
      // attackResult.sunkShipCoordinates.forEach(coord => {
      //   if (!isIn(coord, sunkList)) {
      //     sunkList.push(coord);
      //   }
      // });
    }

    let newBoard = { ...board }; // Preserve existing shallow copy behavior
    return { ...attackResult, board: newBoard, cell: cell };
  };

  const blackOrWhite = grid.filter(
    (cell, index) => (index + cell[1]) % 2 == toss
  );

  const autoAttack = (board) => {
    let targets = [];
    let target;
    let newTarget;
    let msg;
    //label cell hit but not sunk as clues
  
    let clues = board.hit.filter((cell) => !isIn(cell, sunkList));

    const mode = clues.length;

    if (mode == 0) {
      //hunt
      targets = blackOrWhite;
    }

    if (mode == 1) {
      // target
      //target adjacent cells
      let lastHit = clues[0];
      let letter = lastHit[0];
      let number = lastHit[1];
      let top = [letter, number - 1];
      let bottom = [letter, number + 1];
      let left = [String.fromCharCode(letter.charCodeAt(0) - 1), number];
      let right = [String.fromCharCode(letter.charCodeAt(0) + 1), number];
      targets.push(top, bottom, left, right);
    }

    if (mode >= 2) {
      //destroy
      //detemine axis of alignement
      let lastHit = clues[0][0];
      let previousHit = clues[1];
      let changingAxis = clues[0][0] == clues[1][0] ? 1 : 0;
      let fixedAxis = (changingAxis + 1) % 2;

      //get first and last cell of clues
      let first = clues.reduce(
        (acc, curr) => (acc[changingAxis] > curr[changingAxis] ? curr : acc),
        clues[0]
      );

      let last = clues.reduce(
        (acc, curr) => (acc[changingAxis] < curr[changingAxis] ? curr : acc),
        clues[0]
      );

      //figure out the before and after cell to target
      let before = [];
      before[fixedAxis] = first[fixedAxis];
      before[changingAxis] = isNaN(first[changingAxis])
        ? String.fromCharCode(first[changingAxis].charCodeAt(0) - 1)
        : first[changingAxis] - 1;

      let after = [];
      after[fixedAxis] = last[fixedAxis];
      after[changingAxis] = isNaN(last[changingAxis])
        ? String.fromCharCode(last[changingAxis].charCodeAt(0) + 1)
        : last[changingAxis] + 1;

      targets = [after, before];
      
    }
    //Keep only cells that are in the grid
    targets = targets.filter((cell) => isARealCell(cell));

    //and that haven't been attacked yet
    targets = targets.filter((cell) => !isIn(cell, board.attackedLocations()));

    if (targets.length === 0) {
      // Fallback to hunt mode
      let possibleCells = grid.filter(
        (cell) => !isIn(cell, board.attackedLocations())
      );
      newTarget = possibleCells[getRandomInt(possibleCells.length)];
    } else {
      newTarget = targets[getRandomInt(targets.length)];
    }

    if (newTarget === undefined) {
      console.warn("AI has no valid moves left.");
      return; 
    }

    target = attack(board, newTarget); // target is now { message, sunkShipCoordinates, board, cell }
    
    // The entire block below is removed as sunkList is now updated in the attack function
    // based on sunkShipCoordinates from receiveAttack.
    // if (isIn(target.cell,board.sunk)) {
    //   let lastShipSunk = board.sunkShips().at(-1);
    //   
    //   // get the ship size 
    //   let boatSize = getShipSize(lastShipSunk);
    //   
    //   //get last sunk cells
    //   let newSunkCells = board.hit.slice(-boatSize);
    //   newSunkCells.pop();// The last is already marked as sunk
    //   //mark them as sunk
    //   console.log({fire: target.cell})
    //   sunkList = sunkList.concat(newSunkCells);
    // }
    
    return { ...target };
  };

  return {
    attack,
    autoAttack,
    gameboard,
    toss,
  };
}
