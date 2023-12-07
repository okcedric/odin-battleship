import { grid, isIn } from "./helpers";

function Overlay({ overlay, msg, handleRoger }) {

  return overlay ? (
          <div className="overlay">
            <p id="msg">{msg}</p>
          <button onClick={() => handleRoger()}>Roger That</button>
        </div>
     
  
  ) : (<></>)
}

function Grid({ handleClick, board, msg }) {
    
    let sunk = board.sunk();
    //if a ship sunk has a name === 
  return (
    <>
      <div className="left">
        <div className="title">
          <h1>Battleship</h1>
          <h3>This is a game of war!</h3>
        </div>
        <div className="scoreBoard target">
          <h2>Targets</h2>
          <div className="score">
            <h3 id="carrier">
              Carrier(5) :
              {sunk.includes("Carrier") ? (
                <span className="sunk">sunk</span>
              ) : (
                <span>Afloat</span>
              )}
            </h3>
            <h3 id="battleship">
              Battleship(4) :{" "}
              {sunk.includes("Battleship") ? (
                <span className="sunk">sunk</span>
              ) : (
                <span>Afloat</span>
              )}
            </h3>
            <h3 id="destroyer">
              Destroyer(3) :{" "}
              {sunk.includes("Destroyer") ? (
                <span className="sunk">sunk</span>
              ) : (
                <span>Afloat</span>
              )}
            </h3>
            <h3 id="submarine">
              Submarine(3) :{" "}
              {sunk.includes("Submarine") ? (
                <span className="sunk">sunk</span>
              ) : (
                <span>Afloat</span>
              )}
            </h3>
            <h3 id="patrol">
              Patrol Boat(2) :{" "}
              {sunk.includes("Patrol Boat") ? (
                <span className="sunk">sunk</span>
              ) : (
                <span>Afloat</span>
              )}
            </h3>
          </div>
        </div>
      </div>
      <div className="grid-wrapper">
        <p id="msg">{msg}</p>
        <div className="grid">
          {grid.map((cell) => {
            let id = "opp-" + cell.toString();
            let cellClass = "cell";

            if (isIn(cell, board.hit)) cellClass += " hit";
            if (isIn(cell, board.missed)) cellClass += " missed";
            return (
              <div
                id={id}
                key={id}
                className={cellClass}
                onClick={() => handleClick(cell)}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function MiniGrid({ board }) {
    let sunk = board.sunk();
  return (
    <div className="scoreBoard player">
      <h2>Your ships</h2>
      <div className="score">
        <h3 id="carrier">
          Carrier(5) :
          {sunk.includes("Carrier") ? (
            <span className="sunk">sunk</span>
          ) : (
            <span>Afloat</span>
          )}
        </h3>
        <h3 id="battleship">
          Battleship(4) :{" "}
          {sunk.includes("Battleship") ? (
            <span className="sunk">sunk</span>
          ) : (
            <span>Afloat</span>
          )}
        </h3>
        <h3 id="destroyer">
          Destroyer(3) :{" "}
          {sunk.includes("Destroyer") ? (
            <span className="sunk">sunk</span>
          ) : (
            <span>Afloat</span>
          )}
        </h3>
        <h3 id="submarine">
          Submarine(3) :{" "}
          {sunk.includes("Submarine") ? (
            <span className="sunk">sunk</span>
          ) : (
            <span>Afloat</span>
          )}
        </h3>
        <h3 id="patrol">
          Patrol Boat(2) :{" "}
          {sunk.includes("Patrol Boat") ? (
            <span className="sunk">sunk</span>
          ) : (
            <span>Afloat</span>
          )}
        </h3>
      </div>
      <div className="grid">
        {grid.map((cell) => {
          let id = "my-" + cell.toString();
          let cellClass = "mini-cell";
          if (isIn(cell, board.hit)) cellClass += " hit";
          if (isIn(cell, board.missed)) cellClass += " missed";
          return <div id={id} key={id} className={cellClass}></div>;
        })}
      </div>
    </div>
  );
}

export { Grid, MiniGrid,Overlay };
