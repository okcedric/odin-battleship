import {
  isARealCell,
  isIn,
  isOccupied,
  isValidDir,
} from "./helpers";

export default function Gameboard() {
  let shipsAfloat = [];
  let occupiedCells = [];
  let missed = [];
  let hit = [];
  let sunk = [];


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
    //check if cell is valid
    let msg = "";
    if (!isARealCell(cell)) throw new Error("This cell does not exist");

    // check if cell has already been attacked
    if (isIn(cell, attackedLocations())) {
      throw new Error("This cell has already been attacked");
    }
    //if cell is occupied 
    if (isOccupied(cell, occupiedCells)) {
      //if a ship has this coordinate
      for (const ship of shipsAfloat) {
        if (isIn(cell, ship.coordinates)) {
          ship.hit();
          hit.push(cell);

          if (ship.isSunk()) {
            msg = ship.getName();
            // sunk.push(cell); // This was for the old logic, can be removed or kept if specific cell of sinking is needed elsewhere.
            // For now, the task implies sunkShipCoordinates is the source of truth for all cells of a sunk ship.
            return { message: msg, sunkShipCoordinates: ship.coordinates };
          } else {
            msg = "hit";
            return { message: msg, sunkShipCoordinates: null };
          }
        }
      }
      // This part should ideally not be reached if isOccupied(cell, occupiedCells) is true
      // and the cell is indeed part of a ship. If it is reached, it implies an inconsistency.
      // For safety, we can treat it as a miss, though it might mask deeper issues.
      msg = "missed"; 
      missed.push(cell);
      return { message: msg, sunkShipCoordinates: null };

      //else announce the cell as missed
    } else {
      missed.push(cell);
      msg = "missed";
      return { message: msg, sunkShipCoordinates: null };
    }
  };

  const attackedLocations = () => {
    return missed.concat(hit);
  };

  
  const allSunk = () => {
    return shipsAfloat.every((ship)=>ship.isSunk());
  };

  const sunkShips = () => {
    let shipSunk = shipsAfloat.filter((ship) => ship.isSunk());
    return shipSunk.map((ship) => ship.getName())
  };

 
  return {
    place,
    receiveAttack,
    missed,
    hit,
    allSunk,
    attackedLocations,
    sunk,
    sunkShips,
  };
}
