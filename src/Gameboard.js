import Ship from "./Ship";
import {
  isARealCell,
  isIn,
  isOccupied,
  isValidDir,
} from "./helpers";

export default function Gameboard() {
  let shipsAfloat = [];
  let shipSunk = [];
  let occupiedCells = [];
  let missed = [];
  let hit = [];
  const attackedLocations = () => {
    return missed.concat(hit);
  };

  const freeCells = (cells) => {
    occupiedCells = occupiedCells.filter(
      (occupiedCell) => !isIn(occupiedCell, cells)
    );
  };

  const place = (ship, cell, dir) => {
    //check for invalid parameters
    if (!isARealCell(cell)) throw new Error("Coordinates are invalid");
    if (!isValidDir(dir)) throw new Error("Direction is invalid");

    //delete ship from Ship record and previous position from occupied cells record and
    if (ship.coordinates) {
      shipsAfloat.filter((afloatShip) => afloatShip != ship);
      freeCells(ship.coordinates);
    }

    //use direction
    let a = null;
    let b = null;

    if (dir === "v") {
      a = 1;
      b = 0;
    } else {
      a = 0;
      b = 1;
    }
    //for generate cells to occupy
    let cells = [];
    for (let index = 0; index < ship.getSize(); index++) {
      let celltoAdd = [];
      typeof cell[a] == "string"
        ? (celltoAdd[a] = String.fromCharCode(cell[a].charCodeAt(0) + index))
        : (celltoAdd[a] = cell[a] + index);
      celltoAdd[b] = cell[b];
      cells.push(celltoAdd);
      if (!isARealCell(celltoAdd) || isOccupied(celltoAdd, occupiedCells))
        throw new Error(`Your ${ship.getName()} cannot be placed here`);
    }
    occupiedCells = occupiedCells.concat(cells);
    
    let newShip = {
      ...ship,
      coordinates: cells,
    };

    //put the ship afloat
    shipsAfloat.push(newShip);
    return newShip;
  };
  
  const receiveAttack = (cell) => {

    let msg='';
    if (!isARealCell(cell)) throw new Error("This cell does not exist");
    
    // record the location as attacked;
    if (isIn(cell, attackedLocations())) {
      throw new Error("This cell has already been attacked");
    }
    //if cell is occupied find by which ship and hit him return hit or ocean if is sunk
    if (isOccupied(cell, occupiedCells)) {
      shipsAfloat.map((ship) => {
        if (isIn(cell, ship.coordinates)) {
          ship.hit();
          hit.push(cell);
          msg = ship.isSunk() ? ship.getName(): "hit";
          shipSunk.push()
        } 
      });
   
      //else retunr missed
    } else {
      missed.push(cell);
      msg = "missed";
    }
       return msg;
  };

  const getMissed = () => {
    return missed;
  };
  const allSunk = () => {
    return shipsAfloat.every((ship)=>ship.isSunk());
  };
  return {
    place,
    receiveAttack,
    getMissed,
    allSunk,
    attackedLocations,
  };
}
