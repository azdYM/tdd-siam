import { BoardInterface } from "./Board.js"
import { PlayerInterface } from "./Player.js"

export interface IBoardManager {
    execute(): Promise<BoardInterface | undefined>
}

export interface IPlayerManager {
    execute(): Promise<PlayerInterface | undefined>
}

export class Game {
    private board: BoardInterface | null = null
    private players: PlayerInterface[] = []

    constructor(
        private boardManager?: IBoardManager,
        private playerManager?: IPlayerManager
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

    async addPlayer() {
        let player: PlayerInterface | undefined = undefined

        do {
            player = await this.playerManager?.execute()
            if (player) {
                this.players.push(player)
            }
        } while (player !== undefined);
    }
}