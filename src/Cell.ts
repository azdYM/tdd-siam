import { Piece } from "./Piece.js"

export class Cell {
    private piece: Piece|null = null
    constructor(
        public id: number,
    ) {}

    setPiece(piece?: Piece) {
        this.piece = piece ?? null
    }

    getPiece() {
        return this.piece
    }

    isEmpty() {
        return this.piece === null
    }
}