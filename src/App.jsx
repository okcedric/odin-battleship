import "./App.css";
import { Grid, MiniGrid, Overlay } from "./dom";
import Player from "./Player";
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

  //UI

  const changeTurn = () => {
    if (turn === "human") setTurn("cpu");
    if (turn === "cpu") setTurn("human");
  };

  const handleClick = (cell) => {
    fire(human, cell);
  };

  const fire = (player, cell) => {
    let attack =
      player === human
        ? human.attack(cpuBoard, cell)
        : cpu.autoAttack(humanBoard);
    let who = player === human ? "We" : "ennemy";
    let newBoard = attack.board;
    let observation = attack.msg;

    if (observation === "missed") setMsg(who + " missed !");
    if (observation === "hit") setMsg(who + " hit !");
    if (observation != "hit" && observation != "missed") {
      setMsg(observation + " has been taken down !");
    }
    player === human ? setCpuBoard(newBoard) : setHumanBoard(newBoard);
    if (newBoard.allSunk()) {
      let outcome =
        player === human
          ? "Victory ! Ennemy destroyed"
          : "Defeat ! All our ships have been sunk...";
      setMsg(outcome);
    }
    setOverlay(true);
    changeTurn();
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
