import Gameboard from "./Gameboard"
import {isIn, getRandomInt, grid} from './helpers'

export default function Player ()  {
    let gameboard = Gameboard();


const getPossibleTargets = (board) => {
    let possibles = grid.filter((cell) => !isIn(cell, board.attackedLocations()));
    return possibles
}

    const attack = (board,cell) => {
        let msg = board.receiveAttack(cell);

        return { msg: msg, board: { ...board }, cell: cell };
    }

    const autoAttack = (board) => {
        let possibleTargets = getPossibleTargets(board);
        let newTarget = possibleTargets[getRandomInt(possibleTargets.length)];
        return attack(board,newTarget);
        }

    return {
        attack,
        autoAttack,
        gameboard
    }


}