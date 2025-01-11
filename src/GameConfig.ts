import { BoardInterface } from "./Board.js"
import { Config, ConfigManagerInterface } from "./Game.js"
import { PlayerInterface } from "./Player.js"

export interface IBoardManager {
    execute(): Promise<BoardInterface | undefined>
    getBoard(): Promise<BoardInterface | undefined>
}

export interface IPlayerManager {
    execute(numberOfPiecesPerPlayer: number): Promise<PlayerInterface | undefined>
    getPlayers(): Promise<PlayerInterface[]>
}

export class GameConfig implements ConfigManagerInterface {
    private board: BoardInterface | undefined
    private players: PlayerInterface[] = []

    constructor(
        private boardManager?: IBoardManager, 
        private playerManager?: IPlayerManager,
        private NUMBER_OF_PIECES_PER_PLAYER: number = 5
    ) {}

    async initialize(): Promise<Config> {
        this.board = await this.initBoard()
        this.players = await this.initPlayers()

        return { 
            board: this.board, 
            players: this.players 
        }
    }

    getPlayers() {
        return this.players
    }

    getBoard() {
        return this.board
    }

    private async initBoard() {
        return await this.boardManager?.execute() ?? undefined
    }

    private async initPlayers() {
        const players: PlayerInterface[] = []
        let player: PlayerInterface | undefined = undefined
        
        do {
            player = await this.playerManager?.execute(this.NUMBER_OF_PIECES_PER_PLAYER)
            if (player) {
                players.push(player)
            }
        } while (player !== undefined)

        return players
    }
}

