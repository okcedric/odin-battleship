import { expect } from "vitest";
import Player from "./Player.js";
import Ship from "./Ship.js";

test("player can attack the ennemy gameboard", () => {
  let playerOne = Player();
  let playerTwo = Player();
  let ennemyGameboard = playerTwo.gameboard;
  expect(playerOne.attack(ennemyGameboard, ["C", 3]).msg).toBeDefined();
});
test("player can miss", () => {
  let playerOne = Player();
  let playerTwo = Player();
  let ennemyGameboard = playerTwo.gameboard;
  //place a battleship in player 2 gameboard
  expect(playerOne.attack(ennemyGameboard, ["C", 4]).msg).toBe("missed");
  expect(playerOne.attack(ennemyGameboard, ["F", 3]).msg).toBe("missed");
});

test("player can hit ennemies ship", () => {
  let playerOne = Player();
  let playerTwo = Player();
  let ennemyGameboard = playerTwo.gameboard;
  let battleship = Ship(2);
  //place a battleship in player 2 gameboard
  battleship = ennemyGameboard.place(battleship, ["D", 3], "h");
  expect(playerOne.attack(ennemyGameboard, ["F", 3]).msg).toBe("hit");
});

test("player can sink ennemies ship", () => {
  let playerOne = Player();
  let playerTwo = Player();
  let ennemyGameboard = playerTwo.gameboard;
  let battleship = Ship(2);
  //place a battleship in player 2 gameboard
  battleship = ennemyGameboard.place(battleship, ["D", 3], "h");
  expect(playerOne.attack(ennemyGameboard, ["D", 3]).msg).toBe("hit");
  expect(playerOne.attack(ennemyGameboard, ["E", 3]).msg).toBe("hit");
  expect(playerOne.attack(ennemyGameboard, ["F", 3]).msg).toBe("hit");
  expect(playerOne.attack(ennemyGameboard, ["G", 3]).msg).toBe("Battleship");
});

test("computer can randomly attack", () => {
  let human = Player();
  let computer = Player();
  let humanboard = human.gameboard;

  expect(computer.autoAttack(humanboard)).toBeTruthy();
});

test("computer should not shoot the same coordinate twice", () => {
  let human = Player();
  let computer = Player();
  let humanboard = human.gameboard;
  let carrier = Ship(1);
  let submarine = Ship(3);
  let patrolBoat = Ship(5);
  const letterArray = ["A", "B", "D", "E", "F", "G", "H", "I", "J"];
  const numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //human place three boat in the C collumn

  carrier = humanboard.place(carrier, ["C", 1], "v");
  submarine = humanboard.place(submarine, ["C", 6], "v");
  patrolBoat = humanboard.place(patrolBoat, ["C", 9], "v");

  //computer already attacked all the other collumn
  numberArray.forEach((number) => {
    letterArray.forEach((letter) => {
      computer.attack(humanboard, [letter, number]);
    });
  });
  // next shot is a hit for sure
  expect(computer.autoAttack(humanboard).msg).toBe("hit");
});

test("Computer attacks adjacent cells after a successful hit", () => {
  // Setting up players and boards
  let human = Player();
  let computer = Player();
  let humanBoard = human.gameboard;

  // Placing the ship
  humanBoard.place(Ship(5), ["C", 7], "h");

  // Human player receives an attack
  humanBoard.receiveAttack(["C", 7]);

  // Computer performs an automatic attack
  let cellFired = computer.autoAttack(humanBoard).cell;

  // Check if the attacked cell is adjacent
  let expectedCells = [
    ["C", 8],
    ["C", 6],
    ["B", 7],
    ["D", 7],
  ];
  expect(expectedCells).toContainEqual(cellFired);
});

test("Computer attacks aligned cells after two successful hits", () => {
  // Setting up players and boards
  let human = Player();
  let computer = Player();
  let humanBoard = human.gameboard;
  let submarine = Ship(4);

  // Placing the Submarine(3)
  humanBoard.place(submarine, ["C", 7], "h");

  // Human player receives an attack
  humanBoard.receiveAttack(["C", 7]);
  humanBoard.receiveAttack(["D", 7]);

  // Computer performs an automatic attack
  let cellFired = computer.autoAttack(humanBoard).cell;
  // Check if the attacked cell is aligned with previous two hits

  let expectedCells = [
    ["B", 7],
    ["E", 7],
  ];
  expect(expectedCells).toContainEqual(cellFired);
});

test("Computer maintains alignment of attacks until a ship is sunk", () => {
  // Setting up players and boards
  let human = Player();
  let computer = Player();
  let humanBoard = human.gameboard;

  // Placing a ship on the human board
  humanBoard.place(Ship(2), ["E", 5], "v"); // A 4-cell ship

  // Simulating hits on the ship
  humanBoard.receiveAttack(["E", 5]); // First hit
  humanBoard.receiveAttack(["E", 6]); // Second hit

  // Computer performs automatic attacks
  let thirdAttack = computer.autoAttack(humanBoard).cell;
  let fourthAttack = computer.autoAttack(humanBoard).cell;

  // Check if computer maintains horizontal alignment for attacks
  let expectedAlignment = [
    ["E", 7],
    ["E", 4],
    ["E", 8],
    ["E", 3],
  ]; // Remaining possible cells for horizontal alignment
  expect(expectedAlignment).toContainEqual(thirdAttack);
  expect(expectedAlignment).toContainEqual(fourthAttack);
});

test("Computer come back to hunt mode after sinking", () => {
  // Setting up players and boards
  let human = Player();
  let computer = Player();
  let humanBoard = human.gameboard;

  // Placing a ship on the human board
  let submarine = Ship(4);
  humanBoard.place(submarine, ["E", 5], "v"); // A 3-cell ship

  // Simulating hits on the ship
  humanBoard.receiveAttack(["E", 5]); // First hit
  humanBoard.receiveAttack(["E", 6]); // Second hit
  
  // Computer performs automatic attacks
  let thirdAttack = computer.autoAttack(humanBoard);
  let fourthAttack = computer.autoAttack(humanBoard);
  // Check if submarine is sunk
  expect(humanBoard.sunkShips()).toContainEqual("Submarine");
  
  //check if it's still shooting
  let fifthAttack = computer.autoAttack(humanBoard);
  expect(fifthAttack).toBeDefined();
});


test("Computer can handle hitting two different ships on a row",
  () => {
    // Setting up players and boards
    let human = Player();
    let computer = Player();
    let humanBoard = human.gameboard;

    // Placing two ships next to each other on the human board
    let submarine = Ship(4);
    let patrolBoat = Ship(5);
    humanBoard.place(submarine, ["E", 5], "h"); // A 3-cell ship
    humanBoard.place(patrolBoat, ["F", 6], "v"); // A 2-cell ship

    //Simulating a hit on each ship
    humanBoard.receiveAttack(["F", 4]); // Missed
    humanBoard.receiveAttack(["F", 5]); // First hit on submarine
    humanBoard.receiveAttack(["F", 6]); // Second hit on patrol Boat
    expect(computer.autoAttack(humanBoard).cell).toEqual(["F", 7]); // sunking the patrolBoat
    let expectedCells = [
      ["E", 5],
      ["G", 5],
    ];
    let fifthAttack = computer.autoAttack(humanBoard).cell;
    expect(expectedCells).toContainEqual(fifthAttack);
  });