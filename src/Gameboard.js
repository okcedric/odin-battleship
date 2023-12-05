import Ship from "./Ship";
import { useState } from "react";

export default function Gameboard() {
  let shipsAfloat = [];
  let occupiedCells = [];
  let missed = [];
  let hit = [];
  const attackedLocations = () => {
    return missed.concat(hit);
  };

  const isARealCell = (array) => {
    return (
      typeof array == "object" &&
      array.length == 2 &&
      array[0].length == 1 &&
      typeof array[0] == "string" &&
      Number.isInteger(array[1]) &&
      array[0] >= "A" &&
      array[0] <= "J" &&
      array[1] >= 1 &&
      array[1] <= 10
    );
  };

  const areMatching = (a, b) => {
    return a[0] == b[0] && a[1] == b[1];
  };

  const isIn = (targetCell, array) => {
    return array.some((cell) => areMatching(targetCell, cell));
  };
  const isOccupied = (cell) => {
    return isIn(cell, occupiedCells);
  };

  const freeCells = (cells) => {
    occupiedCells = occupiedCells.filter(
      (occupiedCell) => !isIn(occupiedCell, cells)
    );
  };

  const isValidDir = (dir) => {
    return dir === "vertical" || dir === "horizontal";
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

    if (dir === "vertical") {
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
      if (!isARealCell(celltoAdd) || isOccupied(celltoAdd))
        throw new Error(`Your ${ship.getName()} cannot be placed here`);
    }
    occupiedCells = occupiedCells.concat(cells);

    let Newship = {
      ...ship,
      coordinates: cells,
    };
    //put the ship afloat
    shipsAfloat.push(Newship);
    return Newship;
  };

  const receiveAttack = (cell) => {
    if (!isARealCell(cell)) throw new Error("This cell does not exist");

    // record the location as attacked;
    if (isIn(cell, attackedLocations())) {
      throw new Error("This cell has already been attacked");
    }
    //if cell is occupied find by which ship and hit him return the ship
    if (isOccupied(cell)) {
      shipsAfloat.map((ship) => {
        if (isIn(cell, ship.coordinates)) ship.hit();
        hit.push(cell);
        return ship;
      });
    } else {
      missed.push(cell);
      return false;
    }
    //else return false
  };

  const getMissed = () => {
    return missed;
  };
  const allSunk = () => {
    //console.log(shipsAfloat.map((ship)=> ship.isSunk()));
    return shipsAfloat.every((ship)=>ship.isSunk());
  };
  return {
    place,
    receiveAttack,
    getMissed,
    allSunk,
  };
}
