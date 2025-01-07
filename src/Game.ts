import { BoardInterface } from "./Board.js"
import { Cell } from "./Cell.js"
import { Piece } from "./Piece.js"
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
        this.board?.synchronize(this.getPiecesForTeams())
    }

    getBoard() {
        return this.board
    }

    messages() {
        return "Les pièces des deux équipes ont été syncronisé au plateau du jeu"
    }

    status() {
        return [
            'E E E E E',
            'E E E E E',
            'E O O O E',
            'E E E E E',
            'E E E E E',
        ]
    }

    getPlayers() {
        return this.players
    }

    getMovesOptions(piece: Piece, cell: Cell, turn: number) {
        const baseCellsId = [1, 2, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 24, 25]
        const additionalCellsId = [3, 23]
        
        const availableCellsId = turn > 2 
            ? [...baseCellsId, ...additionalCellsId] 
            : baseCellsId

        return this.board?.getPlayArea().filter(cell => availableCellsId.includes(cell?.id))
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