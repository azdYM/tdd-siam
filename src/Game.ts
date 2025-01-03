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

    async start() {
        await this.initBoard()
        await this.initPlayers()
    }

    getBoard() {
        return this.board
    }

    getPlayers() {
        return this.players
    }

    private async initBoard() {
        this.board = await this.boardManager?.execute() ?? null
    }

    private async initPlayers() {
        let player: PlayerInterface | undefined = undefined

        do {
            player = await this.playerManager?.execute()
            if (player) {
                this.players.push(player)
            }
        } while (player !== undefined);
    }
}