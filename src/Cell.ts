import { Piece } from "./Piece.js"

type Position = {
    x: number,
    y: number
}

export class Cell {
    private piece: Piece|null = null
    private position?: Position

    constructor(
        public id: number,
    ) {}

    setPiece(piece?: Piece) {
        this.piece = piece ?? null
    }

    getPiece() {
        return this.piece
    }

    getPosition() {
        return this.position
    }

    setPosition(x: number, y: number) {
        this.position = {x, y}
    }

    isEmpty() {
        return this.piece === null
    }
}