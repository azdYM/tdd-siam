import { AbstractGameSession } from "./AbstractGameSession.js"
import { BoardInterface } from "./Board.js"
import { Cell } from "./Cell.js"
import { Piece } from "./Piece.js"
import { PlayerInterface } from "./Player.js"

export class GameSession extends AbstractGameSession {
    private actionState: ActionState
    
    constructor(
        gameRules: GameRulesInterface, 
        display?: DisplayInterface,
        private turnProcessor?: TurnProcessorInterface
    ) { super(gameRules, display) }

    async start(board?: BoardInterface, players: PlayerInterface[] = []): Promise<void> {
        this.validateBoardAndPlayers(board, players)

        await this.board?.synchronize(this.getPiecesForTeams())
        this.display?.onBoardSynchronized(this.players, this.board)
        this.initState()

        this.turnProcessor?.setParams(this.board, this.gameRules, this.actionState)
        await this.turnProcessor?.playTurn(this.players[0], 1)
    }

    private initState() {
        this.actionState = {
            completedPromise: Promise.resolve(),
            completedResolver: null
        }
    }

    async status(): Promise<string[]> {
        return this.actionState.completedPromise.then(
            () => this.parseAreaPlay()
        )
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
}

export interface GameRulesInterface {
    setBoard(board: BoardInterface): void
    fetchMoveOptions(piece: Piece, cell: Cell, turn: number): Promise<Array<Cell>>
}

export interface DisplayInterface {
    onBoardSynchronized(players: PlayerInterface[], board: BoardInterface): void
    onBoardNotProvided(): void
}

export type ActionState = {
    completedPromise: Promise<void>
    completedResolver: (() => void) | null
}

export interface TurnProcessorInterface {
    setParams(board: BoardInterface, gameRules: GameRulesInterface, actionState: ActionState): void
    playTurn(currentPlayer: PlayerInterface, turn: number): Promise<void>
}



