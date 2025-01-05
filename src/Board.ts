import { IBoardManager } from "./Game.js"
import { Piece } from "./Piece.js"
import { TeamPlayer } from "./Player.js"

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
    getReserveFrom(team: TeamPlayer): Array<unknown>
}

export class Board implements BoardInterface {
    private reserves = []
    constructor(private x: number, private y: number = 1) {}

    size() {
        return this.x * this.y
    }

    createReservesFrom(teams: Array<TeamPlayer>) {
        for (const element of teams) {
            this.reserves[element] = Array.from({ length: this.x }, (_, x) => new Cell(x + 1))
        }
    }

    addPieces(team: TeamPlayer, pices: Array<Piece>) {
        
    }

    getReserveFrom(team: TeamPlayer) {
        return this.reserves[team] ?? []
    }
}

export class Cell {
    constructor(
        public id: number
    ) {}

    isEmpty() {
        return false
    }
}