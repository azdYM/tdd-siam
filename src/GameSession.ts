import { Area, BoardInterface } from "./Board.js"
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
    private actionCompletePromise: Promise<void> = Promise.resolve()
    private actionCompleteResolver: (() => void) | null = null

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

    private async play(player: PlayerInterface, turn: number): Promise<void> {
        this.actionCompletePromise = new Promise(resolve => {
            this.actionCompleteResolver = resolve
        })

        const movesOptions = await this.previewMoves(player, turn)
        await this.move(player)
        
        this.actionCompleteResolver?.()
        this.actionCompleteResolver = null
    }

    private async previewMoves(player: PlayerInterface, turn: number) {
        const entriesPlayer = await this.inputsPlayer?.previewMoves()
        const {piece, currentCell} = this.parseEntriesPlayer(player, entriesPlayer)
        return await this.gameRules.fetchMoveOptions(piece!, currentCell!, turn)
    }

    private async move(player: PlayerInterface) {
        const entriesPlayer = await this.inputsPlayer?.move()
        const {piece, currentCell, nextCell} = this.parseEntriesPlayer(player, entriesPlayer)
        currentCell?.setPiece()
        nextCell?.setPiece(piece)
    }

    getPlayers(): PlayerInterface[] {
        return this.players
    }

    getBoard(): BoardInterface {
        return this.board
    }

    async status(): Promise<string[]> {
        return this.actionCompletePromise.then(() => this.parseAreaPlay())
    }

    private parseAreaPlay() {
        return Array.from(
            { length: this.board.rows() }, 
            (_, x) => this.lineOf(x + 1)
        )
    }

    private lineOf(row: number) {
        const parsed = Array.from(
            { length: this.board.columns() }, 
            (_, y) => this.contentOf(row, y + 1)
        )

        return parsed.join(' ')
    }

    private contentOf(row: number, column: number) {
        const piece = this.board.getPlayArea().find(cell => cell.at(row, column))?.getPiece()
        let contentCell = "EE"

        if (piece?.type === 'Rock') {
            contentCell = piece.id
        } else if(piece?.type === 'Elephant') {
            contentCell = piece.id
        }

        return contentCell
    }

    private parseEntriesPlayer(player: PlayerInterface, entries?: EntriesPlayer) {
        const piece = player?.getPieces().find(piece => piece.id === entries?.pieceId)
        let currentCell: Cell | null = null
        let nextCell: Cell | null = null

        if (entries?.action === 'Preview') {
            currentCell = this.board?.getCellFor(entries.currentCellId, 'Reserve', player.getTeam())
        } else if (entries?.action === 'Move') {
            currentCell = this.board?.getCellFor(entries.currentCellId, 'Reserve', player.getTeam())
            nextCell = this.board?.getCellFor(entries.nextCellId!, 'Play')
        }
        
        return {piece, currentCell, nextCell}
    }
}

type Action = 'Preview' | 'Move'

export type EntriesPlayer = {
    pieceId: string, 
    currentCellId: number
    nextCellId?: number, 
    area: Area,
    action: Action
}

export interface PlayerGameInputsInterface {
    previewMoves(): Promise<EntriesPlayer | undefined>
    move(): Promise<EntriesPlayer | undefined>
} 