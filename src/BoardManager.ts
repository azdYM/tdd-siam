import { BoardInterface } from "./Board.js"
import { IBoardManager } from "./Game.js"

export class BoardManager implements IBoardManager {
    constructor(private input: BoardInputInterface) {}

    async execute(): Promise<BoardInterface | undefined> {
        return await this.input.load()
    }
}

export interface BoardInputInterface {
    load(): Promise<BoardInterface | undefined>
}