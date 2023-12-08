import "./App.css";
import { Grid, MiniGrid, Overlay } from "./dom";
import Player from "./Player.js";
import Ship from "./Ship";
import { useState } from "react";

function App() {
  const human = Player();
  const cpu = Player();
  const [humanBoard, setHumanBoard] = useState(human.gameboard);
  const [cpuBoard, setCpuBoard] = useState(cpu.gameboard);
  const [msg, setMsg] = useState("Player 1: Choose wisely");
  const [overlay, setOverlay] = useState(false);
  const [turn, setTurn] = useState("human");
  const [score, setScore] = useState({human : 0,  cpu:0});

  // place human ships
  let carrier = human.gameboard.place(Ship(1), ["E", 4], "h");
  let battleship = human.gameboard.place(Ship(2), ["A", 7], "h");
  let destroyer = human.gameboard.place(Ship(3), ["B", 2], "v");
  let submarine = human.gameboard.place(Ship(4), ["H", 9], "h");
  let patrolBoat = human.gameboard.place(Ship(5), ["H", 2], "v");

  // place computer ship
  let c = cpu.gameboard.place(Ship(1), ["E", 4], "h");
  let b = cpu.gameboard.place(Ship(2), ["A", 7], "h");
  let d = cpu.gameboard.place(Ship(3), ["B", 2], "v");
  let s = cpu.gameboard.place(Ship(4), ["H", 9], "h");
  let p = cpu.gameboard.place(Ship(5), ["H", 2], "v");

  //
  const reset = () => {
    setCpuBoard(cpu.gameboard);
    setHumanBoard(human.gameboard);
    setTurn('human');
  }

  const changeTurn = () => {
    if (turn === "human") setTurn("cpu");
    if (turn === "cpu") setTurn("human");
  };

  const handleClick = (cell) => {
    fire(human, cell);
  };

  const fire = (player, cell) => {
    //attack
   let attack;
      if (player === human){
        attack = human.attack(cpuBoard, cell);
         setCpuBoard(attack.board);
      }else {
        attack = cpu.autoAttack(humanBoard);
        setHumanBoard(attack.board);
      } ;
 
    // show message
   
    let who = player === human ? "We" : "ennemy";

    if (attack.msg === "missed") setMsg(who + " missed !");
    if (attack.msg === "hit") setMsg(who + " hit !");
    if (attack.msg != "hit" && attack.msg != "missed") {
      setMsg(attack.msg + " has been taken down !");
    }
    // Show overlay
    setOverlay(true);

    if (attack.board.allSunk()) {
      setMsg(
        player === human
          ? "Victory ! Ennemy destroyed"
          : "Defeat ! All our ships have been sunk..."
      );
      reset();
    } else {
      changeTurn();
    }

  };

  const handleRoger = () => {
    setOverlay(false);
    if (turn == "cpu") {
      fire(cpu);
    }
  };

  return (
    <>
      <Grid handleClick={handleClick} board={cpuBoard} msg={msg}></Grid>
      <MiniGrid board={humanBoard} />
      <Overlay overlay={overlay} msg={msg} handleRoger={handleRoger}></Overlay>
    </>
  );
}

export default App;
