import "./App.css";
import { Grid, MiniGrid } from "./dom";
import Player from "./Player";
import Ship from "./Ship";

function App() {
  const human = Player();
  const humanBoard = human.gameboard;
  const cpu = Player();
  const cpuBoard = cpu.gameboard;
  const playing = "human";

  // place human ships
  let carrier = humanBoard.place(Ship(1), ["E", 4], "h");
  let battleship = humanBoard.place(Ship(2), ["A", 7], "h");
  let destroyer = humanBoard.place(Ship(3), ["B", 2], "v");
  let submarine = humanBoard.place(Ship(4), ["H", 9], "h");
  let patrolBoat = humanBoard.place(Ship(5), ["H", 2], "v");

  // place computer ship
  let c = cpuBoard.place(Ship(1), ["E", 4], "h");
  let b = cpuBoard.place(Ship(2), ["A", 7], "h");
  let d = cpuBoard.place(Ship(3), ["B", 2], "v");
  let s = cpuBoard.place(Ship(4), ["H", 9], "h");
  let p = cpuBoard.place(Ship(5), ["H", 2], "v");

  //UI

  const handleClick = (cell) => {
    const messageBoard = document.getElementById("msg");
    let msg = human.attack(cpuBoard, cell);
    let id = "opp-" + cell.toString();

    let cellDiv = document.getElementById(id);

    if (msg != "hit" && msg != "missed") {
      cellDiv.classList.add("hit");
      msg += " have been sunk !";
    } else {
      cellDiv.classList.add(msg);
    }
    messageBoard.innerHTML = msg;

    if (cpuBoard.allSunk()) {
      msg = "Congrats ! You won !";
      messageBoard.innerHTML = msg;
    } else {
      let ripost = cpu.autoAttack(humanBoard);
      console.info(ripost);
    }
  };

  return (
    <>
      <header>
        <div className="title">
          <h1>Battleship</h1>
          <p>This a game of war.</p>
        </div>
        <Grid handleClick={handleClick}></Grid>
        <div className="scoreBoard">
          <p id="carrier">
            Carrier(5) : <span>Afloat</span>
          </p>
          <p id="battleship">
            Battleship(4) : <span>Afloat</span>
          </p>
          <p id="destroyer">
            Destroyer(3) : <span>Afloat</span>
          </p>
          <p id="submarine">
            Submarine(3) : <span>Afloat</span>
          </p>
          <p id="patrol">
            Patrol Boat(2) : <span>Afloat</span>
          </p>
          <MiniGrid />
        </div>
      </header>
    </>
  );
}

export default App;
