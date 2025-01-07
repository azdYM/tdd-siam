import { BoardInterface } from "./Board.js";
import { Cell } from "./Cell.js";
import { GameRulesInterface } from "./GameSession.js";
import { Piece } from "./Piece.js";

export class GameRules implements GameRulesInterface {
    private board: BoardInterface
    
    setBoard(board: BoardInterface): void {
        this.board = board
    }
    
    async fetchMoveOptions(piece: Piece, cell: Cell, turn: number) {
        const baseCellsId = [1, 2, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 24, 25]
        const additionalCellsId = [3, 23]

        
        const availableCellsId = turn > 2 
            ? [...baseCellsId, ...additionalCellsId] 
            : baseCellsId

        return this.board?.getPlayArea().filter(cell => availableCellsId.includes(cell?.id))
    }
}