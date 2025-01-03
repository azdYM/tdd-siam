export class Board {
    constructor(private x: number, private y: number = 1) {}
    size() {
        return this.x * this.y
    }
}

export class Player {

}

export class Game {
    private board: Board | null = null
    private players: Player[] = []

    getBoard() {
        return this.board
    }

    setBoard(board: Board) {
        this.board = board
    }

    getPlayers() {
        return this.players
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }
}