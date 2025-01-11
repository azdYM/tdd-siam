import { ActionState, GameRulesInterface, TurnProcessorInterface } from "./GameSession.js";
import { Area, BoardInterface } from "./Board.js";
import { Cell } from "./Cell.js";
import { PlayerInterface } from "./Player.js";

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

export class PlayerAction implements TurnProcessorInterface {
    private board: BoardInterface
    private gameRules: GameRulesInterface
    private actionState: ActionState

    constructor(private inputsPlayer?: PlayerGameInputsInterface) {}

    setParams(board: BoardInterface, gameRules: GameRulesInterface, actionState: ActionState): void {
        this.board = board
        this.gameRules = gameRules
        this.actionState = actionState
    }

    async playTurn(currentPlayer: PlayerInterface, turn: number): Promise<void> {
        this.startAction()
        const movesOptions = await this.previewMoves(currentPlayer, turn)
        await this.move(currentPlayer)
        this.endAction()
    }

    private startAction() {
        this.actionState.completedPromise = new Promise(resolve => {
            this.actionState.completedResolver = resolve
        })
    }

    private endAction() {
        this.actionState.completedResolver?.()
        this.actionState.completedResolver = null
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

