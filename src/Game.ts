import { BoardInterface } from "./Board.js"

export interface IBoardManager {
    execute(): Promise<BoardInterface | undefined>
}

export class Player {}

export class Game {
    private board: BoardInterface | null = null
    private players: Player[] = []

    constructor(
        private boardManager?: IBoardManager
    ) {}

    getBoard() {
        return this.board
    }

    async setBoard() {
        this.board = await this.boardManager?.execute() ?? null
    }

    getPlayers() {
        return this.players
    }

    addPlayer(player: Player) {
        this.players?.push(player)
    }
}