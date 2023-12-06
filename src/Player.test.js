import { expect } from "vitest";
import Player from "./Player";
import Ship from "./Ship";

test('player can attack the ennemy gameboard',() => {
    let playerOne = Player();
    let playerTwo = Player();
    let ennemyGameboard = playerTwo.gameboard;
    expect(playerOne.attack(ennemyGameboard,["C",3])).toBeDefined();
})
test("player can miss", () => {
  let playerOne = Player();
  let playerTwo = Player();
  let ennemyGameboard = playerTwo.gameboard;
  //place a battleship in player 2 gameboard
  expect(playerOne.attack(ennemyGameboard, ["C", 4])).toBe("missed");
  expect(playerOne.attack(ennemyGameboard, ["F", 3])).toBe("missed");
});

test ('player can hit ennemies ship', () => {
    let playerOne = Player();
    let playerTwo = Player();
    let ennemyGameboard = playerTwo.gameboard;
    let battleship = Ship(2);
    //place a battleship in player 2 gameboard
    battleship = ennemyGameboard.place(battleship,['D',3],"h");
    expect(playerOne.attack(ennemyGameboard,['F',3])).toBe('hit');
})

test ('player can sink ennemies ship', ()=>{
    let playerOne = Player();
    let playerTwo = Player();
    let ennemyGameboard = playerTwo.gameboard;
    let battleship = Ship(2);
    //place a battleship in player 2 gameboard
    battleship = ennemyGameboard.place(battleship, ["D", 3], "h");
    expect(playerOne.attack(ennemyGameboard, ["D", 3])).toBe("hit");
    expect(playerOne.attack(ennemyGameboard, ["E", 3])).toBe("hit");
    expect(playerOne.attack(ennemyGameboard, ["F", 3])).toBe("hit");
    expect(playerOne.attack(ennemyGameboard, ["G", 3])).toBe("Battleship");

});

test('computer can randomly attack', () =>{
    let human = Player();
    let computer = Player();
    let humanboard = human.gameboard;
    
    expect(computer.autoAttack(humanboard)).toBeTruthy();
})



test('computer should not shoot the same coordinate twice',()=> {
     let human = Player();
     let computer = Player();
     let humanboard = human.gameboard;
     let carrier = Ship(1);
     let submarine = Ship(3);
     let patrolBoat = Ship(5);
     const letterArray = ["A", "B", "D", "E", "F", "G", "H", "I", "J"];
     const numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
     //human place three boat in the C collumn 

    carrier = humanboard.place(carrier,["C",1],"v");
    submarine = humanboard.place(submarine,["C",6],"v");
    patrolBoat = humanboard.place(patrolBoat,["C",9],"v");

     //computer already attacked all the other collumn 
    numberArray.forEach((number) => {
      letterArray.forEach((letter) => {
        computer.attack(humanboard,[letter,number])
      });
    });
    // next shot is a hit for sure 
    expect(computer.autoAttack(humanboard).msg).toBe('hit');

})