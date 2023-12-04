export default function Ship(type) {
    if (!Number.isInteger(type) || type < 1 || type > 5)
      throw new Error("The type is an integer between 1 and 5");
  const shipType = type;
  let name = null;
  let size = null;
  if (type === 1) {
    size = 5;
    name = "Carrier";
  }
  if (type === 2) {
    size = 4;
    name = "Battleship";
  }
  if (type === 3) {
    size = 3;
    name = "Destroyer";
  }
  if (type === 4) {
    size = 3;
    name = "Submarine";
  }
  if (type === 5) {
    size = 2;
    name = "Patrol Boat";
  }

  let hits = 0;
  const hit = () => hits++;
  const isSunk = () => hits == size;
  const getName = () => name;

  return {
    getName,
    hit,
    isSunk,
  };
}
