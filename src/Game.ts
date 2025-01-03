export class Board {
    constructor(private x: number, private y: number = 1) {}
    size() {
        return this.x * this.y
    }
}

export class Game {
    private board: Board | null = null

    getBoard() {
        return this.board
    }

    setBoard(board: Board) {
        this.board = board
    }
}