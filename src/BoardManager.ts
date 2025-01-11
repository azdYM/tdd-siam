import { BoardInterface } from "./Board.js"
import { IBoardManager } from "./Game.js"

export class BoardManager implements IBoardManager {
    private board: BoardInterface | undefined
    constructor(private input: BoardInputInterface) {}

    async execute(): Promise<BoardInterface | undefined> {
        return await this.input.load()
    }

    async getBoard(): Promise<BoardInterface | undefined> {
        return this.board
    }
}

export interface BoardInputInterface {
    load(): Promise<BoardInterface | undefined>
}