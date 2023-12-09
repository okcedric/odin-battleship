import { grid, isIn } from "./helpers";

function Overlay({ overlay, msg, handleRoger,end,reset }) {

  return overlay ? (
          <div className="overlay">
            <p id="msg">{msg}</p>
          {end() 
          ? <button onClick={() => reset()}>New Game</button>
          :<button onClick={() => handleRoger()}>Roger That</button>
          }
        </div>
     
  
  ) : (<></>)
}

function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function Fleet ({board}) {
  let sunk = board.sunkShips();
  return (
    <div>
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
  );
}
function Grid({ handleClick, board,}) {
    
    
    //if a ship sunk has a name === 
  return (
    <>
      
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
    </>
  );
}

function MiniGrid({ board }) {
  return (
    
      <div className="grid">
        {grid.map((cell) => {
          let id = "my-" + cell.toString();
          let cellClass = "mini-cell";
          if (isIn(cell, board.hit)) cellClass += " hit";
          if (isIn(cell, board.missed)) cellClass += " missed";
          return <div id={id} key={id} className={cellClass}></div>;
        })}
      </div>
   
  );
}

export { Grid, MiniGrid,Overlay, Card, Fleet };
