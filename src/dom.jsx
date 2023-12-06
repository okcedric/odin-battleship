import { grid } from "./helpers";


function Grid({handleClick}){
    return (
      <div className="grid-wrapper">
        <p id="msg"><b>Player 1 :</b> Choose wisely</p>
        <div className="grid">
          {grid.map((cell) => {
            let id = "opp-" + cell.toString();
            return (
              <div
                id={id}
                key={id}
                className="cell"
                onClick={()=>handleClick(cell)}
              ></div>
            );
          })}
        </div>
      </div>
    );
}

function MiniGrid(){
    return (
      <>
        <h3>Your ships :</h3>
        <div className="grid">
          {grid.map((cell) => {
             let id = "my-" + cell.toString();
            return (
              <div
                id={id}
                key={id}
                className="mini-cell"
              ></div>
            );
          })}
        </div>
      </>
    );
}

export  {Grid,MiniGrid};