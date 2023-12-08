import "./App.css";
import { Grid, MiniGrid, Overlay, Card, Fleet } from "./dom";
import Player from "./Player.js";
import Ship from "./Ship";
import { useState } from "react";

function App() {
  const human = Player();
  const cpu = Player();
  const [humanBoard, setHumanBoard] = useState(human.gameboard);
  const [cpuBoard, setCpuBoard] = useState(cpu.gameboard);
  const [msg, setMsg] = useState("Declare the war by clicking a cell");
  const [overlay, setOverlay] = useState(false);
  const [turn, setTurn] = useState("human");
  const [score, setScore] = useState({ human: 0, cpu: 0 });
  const end = () => cpuBoard.allSunk() || humanBoard.allSunk();

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
    setTurn("human");
    setMsg("HUMAN : " + score.human + " CPU : " + score.cpu);
  };

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
    if (player === human) {
      attack = human.attack(cpuBoard, cell);
      setCpuBoard(attack.board);
    } else {
      attack = cpu.autoAttack(humanBoard);
      setHumanBoard(attack.board);
    }

    // show message

    let who = player === human ? "We" : "ennemy";

    if (attack.msg === "missed") setMsg(who + " missed !");
    if (attack.msg === "hit") setMsg(who + " hit !");
    if (attack.msg != "hit" && attack.msg != "missed") {
      setMsg(attack.msg + " has been taken down !");
    }
    // Show overlay
    setOverlay(true);

    //End of the game
    if (attack.board.allSunk()) {
      let newScore;

      if (player === human) {
        setMsg("Victory ! Ennemy destroyed");
        newScore = { ...score, human: score.human + 1 };
        setScore(newScore);
      } else {
        setMsg("Defeat ! All our ships have been sunk...");
        newScore = { ...score, cpu: score.cpu + 1 };
        setScore(newScore);
      }
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
      <div className="title">
        <div>
        <h1>Battleship</h1>
        <h3>This is a game of war!</h3>
        </div>
        <Card title={msg}></Card>
      </div>
      <main>
        <div className="left">
          <Card title="Score">
            <div>
              <h3>HUMAN: {score.human}</h3>
              <h3>CPU: {score.cpu}</h3>
            </div>
          </Card>
          <Card title="Targets">
            <Fleet board={cpuBoard} />
          </Card>
        </div>
        <div className="center">
          <Grid
            handleClick={handleClick}
            board={cpuBoard}
            msg={msg}
            score={score}
          ></Grid>
        </div>
        <div className="right">
          <Card title="Your fleet">
            <Fleet board={humanBoard}></Fleet>
            <MiniGrid board={humanBoard} />
          </Card>
        </div>

        <Overlay
          overlay={overlay}
          msg={msg}
          handleRoger={handleRoger}
          end={end}
          reset={reset}
        ></Overlay>
      </main>
    </>
  );
}

export default App;
