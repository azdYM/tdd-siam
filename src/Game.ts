import { BoardInterface } from "./Board.js"
import { PiecesPerTeam, PlayerInterface } from "./Player.js"

export interface IBoardManager {
    execute(): Promise<BoardInterface | undefined>
}

export interface IPlayerManager {
    execute(numberOfPiecesPerPlayer: number): Promise<PlayerInterface | undefined>
}

export class Game {
    private board: BoardInterface | null = null
    private players: PlayerInterface[] = []
    private NUMBER_OF_PIECES_PER_PLAYER = 7

    constructor(
        private boardManager?: IBoardManager,
        private playerManager?: IPlayerManager,
    ) {}

    async start() {
        await this.initBoard()
        await this.initPlayers()
        this.board?.syncronizeTeamsPieces(this.getPiecesForTeams())
    }

    getBoard() {
        return this.board
    }

    status() {
        return "Les pièces des deux équipes ont été syncronisé au plateau du jeu"
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
            player = await this.playerManager?.execute(this.NUMBER_OF_PIECES_PER_PLAYER)
            if (player) {
                this.players.push(player)
            }
        } while (player !== undefined);
    }

    private getPiecesForTeams(): PiecesPerTeam[] {
        return this.players.map(player => ({
            team: player.getTeam(), 
            pieces: player.getPieces()
        }))
    }
}