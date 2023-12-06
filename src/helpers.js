const isARealCell = (array) => {
  return (
    typeof array == "object" &&
    array.length == 2 &&
    array[0].length == 1 &&
    typeof array[0] == "string" &&
    Number.isInteger(array[1]) &&
    array[0] >= "A" &&
    array[0] <= "J" &&
    array[1] >= 1 &&
    array[1] <= 10
  );
};

const areMatching = (a, b) => {
  return a[0] == b[0] && a[1] == b[1];
};

const isIn = (targetCell, array) => {
  return array.some((cell) => areMatching(targetCell, cell));
};
const isOccupied = (cell,occupiedCells) => {
  return isIn(cell, occupiedCells);
};


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const isValidDir = (dir) => {
  return dir === "v" || dir === "h";
};

//grid of all cells
const letterArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const grid = [];
numberArray.forEach((number) => {
  letterArray.forEach((letter) => {
    grid.push([letter, number]);
  });
});


export  {isARealCell,areMatching,isIn,isOccupied,isValidDir,getRandomInt, grid}