import { BoardInterface } from "./Board.js"
import { Cell } from "./Cell.js"
import { SessionInterface } from "./Game.js"
import { Piece } from "./Piece.js"
import { PlayerInterface } from "./Player.js"

export interface GameRulesInterface {
    setBoard(board: BoardInterface): void
    fetchMoveOptions(piece: Piece, cell: Cell, turn: number): Promise<Array<Cell>>
}

export class GameSession implements SessionInterface {
    private board: BoardInterface
    private players: PlayerInterface[]

    constructor(
        private gameRules: GameRulesInterface, 
        private inputsPlayer?: PlayerGameInputsInterface
    ) {}

    async start(board: BoardInterface, players: PlayerInterface[]): Promise<void> {
        this.board = board
        this.gameRules.setBoard(board)
        this.players = players
        await this.play(this.players[0], 1)
    }

    getPlayers(): PlayerInterface[] {
        return this.players
    }

    getBoard(): BoardInterface {
        return this.board
    }

    status(): Array<string> {
        return [
            'E E E E E',
            'E E E E E',
            'E O O O E',
            'E E E E E',
            'E E E E E',
        ]
    }

    private async play(player: PlayerInterface, turn: number): Promise<void> {
        const entriesPlayer = await this.inputsPlayer?.previewMoves()
        const piece = player?.getPieces().find(piece => piece.id === entriesPlayer?.pieceId)
        const currentCell = this.board?.getReserveFor(player?.getTeam())?.cells!.find(cell => cell.id === entriesPlayer?.currentCellId)
        const movesOptions = await this.gameRules.fetchMoveOptions(piece!, currentCell!, turn)
    }
}

type Area = 'Play' | 'Reserve'

export type EntriesPlayer = {
    pieceId: number, 
    currentCellId: number, 
    area: Area
}

export interface PlayerGameInputsInterface {
    previewMoves(): Promise<EntriesPlayer | undefined>;
} 