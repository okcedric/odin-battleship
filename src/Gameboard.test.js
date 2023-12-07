import { expect } from "vitest";
import Ship from "./Ship";
import Gameboard from "./Gameboard";

let carrier = Ship(1);
let battleship = Ship(2);
let destroyer = Ship(3);
let submarine = Ship(4);
let patrolBoat = Ship(5);

test("can place a ship", () => {
  let gameboard = Gameboard();
  expect(gameboard.place(Ship(1), ["A", 3], "v")).toBeDefined();
});

//coordinates check
test("throws when coordinates origin are invalid", () => {
  let gameboard = Gameboard();
  expect(() => {
    gameboard.place(carrier, ["Jack", 3], "v");
  }).toThrow("Coordinates");

  expect(() => {
    gameboard.place(battleship, ["B", 3.3], "v");
  }).toThrow("Coordinates");
  expect(() => {
    gameboard.place(carrier, [5, "E"], "v");
  }).toThrow("Coordinates");
});

test("throws when coordinates origin  of is out of the grid", () => {
  let gameboard = Gameboard();
  expect(() => {
    gameboard.place(destroyer, ["V", 2], "h");
  }).toThrow("Coordinates");
  expect(() => {
    gameboard.place(submarine, ["B", 13], "v");
  }).toThrow("Coordinates");
});


// direction check
test("throws when direction is invalid or absent", () => {
  let gameboard = Gameboard();
  expect(() => {
    gameboard.place(destroyer, ["F", 9], "g");
  }).toThrow("Direction");
  expect(() => {
    gameboard.place(patrolBoat, ["F", 9]);
  }).toThrow("Direction");
});

test("returns an array of valid cells", () => {
  let gameboard = Gameboard();
  expect(gameboard.place(submarine, ["A", 3], "h")).toEqual({
    ...submarine,
    coordinates: [
      ["A", 3],
      ["B", 3],
      ["C", 3],
    ],
  });
});

test("throws an error when the ship cannot fit the grid", () => {
  let gameboard = Gameboard();
  expect(() => {
    gameboard.place(destroyer, ["F", 9], "v");
  }).toThrow("placed");
  expect(() => {
    gameboard.place(carrier, ["G", 7], "h");
  }).toThrow("placed");
});

test("throws an error when the ship is placed on another ship", () => {
  let gameboard = Gameboard();
  expect(gameboard.place(battleship, ["E", 4], "h")).toBeDefined();
  expect(() => {
    gameboard.place(patrolBoat, ["G", 3], "v");
  }).toThrow("placed");

  let gameboard2 = Gameboard();
  expect(gameboard2.place(patrolBoat, ["G", 3], "v")).toBeDefined();
  expect(() => {
    gameboard2.place(battleship, ["E", 4], "h");
  }).toThrow("placed");
});

test("can replace ship", () => {
  let gameboard = Gameboard();
  carrier = gameboard.place(carrier, ["G", 3], "v");
  expect(() => {
    carrier = gameboard.place(carrier, ["G", 4], "v");
  }).not.toThrow();
});

test("can receive an attack", () => {
  let gameboard = Gameboard();
  carrier = gameboard.place(carrier, ["G", 3], "v");
//hit every coordinates of carrier
  carrier.coordinates.map((cell) => {
    gameboard.receiveAttack(cell);
  });
  expect(carrier.isSunk()).toBe(true);
});


test("cannot receive attack in the same cell twice", () => {
  let gameboard = Gameboard();
  carrier = gameboard.place(carrier, ["B", 3], "v");

  gameboard.receiveAttack(["G", 4]);
  gameboard.receiveAttack(["B", 3]);

  expect(() => {
    gameboard.receiveAttack(["G", 3]);
  }).not.toThrow("already been attacked");
  expect(() => {
    gameboard.receiveAttack(["B", 3]);
  }).toThrow("already been attacked");
  expect(() => {
    gameboard.receiveAttack(["G", 4]);
  }).toThrow("already been attacked");
  
});

test("keep track of missed attacks", () => {
  let gameboard = Gameboard();
  carrier = gameboard.place(carrier, ["G", 3], "v");
  gameboard.receiveAttack(["G", 2]);
  gameboard.receiveAttack(["G", 4]);
  gameboard.receiveAttack(["A", 9]);

  expect(gameboard.missed).toEqual([["G",2],["A", 9]])
});

test("reports whether or not all of their ships have been sunk",() => {
  let gameboard = Gameboard();
  patrolBoat = gameboard.place(patrolBoat, ["C", 7], "h");
  submarine = gameboard.place(submarine, ["H", 2], "v");

  //sink submarine
  submarine.coordinates.map((cell) => {
    gameboard.receiveAttack(cell);
  });
  expect(submarine.isSunk()).toBe(true);
  
  // hit patrolBoat once;
  gameboard.receiveAttack(["C", 7]);
  expect(submarine.isSunk()).toBe(true);
  expect(gameboard.allSunk()).toBe(false);

  //sink patrolBoat
  gameboard.receiveAttack(["D", 7]);
  expect(gameboard.allSunk()).toBe(true);
});
