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

export interface BoardInterface {
    size(): number
}

export class Board {
    constructor(private x: number, private y: number = 1) {}
    size() {
        return this.x * this.y
    }
}