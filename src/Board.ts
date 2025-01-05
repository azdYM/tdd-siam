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
    getReserveFrom(team: TeamPlayer): ReserveArea|undefined
}

type ReserveArea = {
    team: TeamPlayer,
    cells: Cell[]
}

export class Board implements BoardInterface {
    private reserves: ReserveArea[] = []
    constructor(private x: number, private y: number = 1) {}

    size() {
        return this.x * this.y
    }

    createReservesFrom(teams: Array<TeamPlayer>) {
        for (const team of teams) {
            this.reserves.push({team, cells: this.createCells()})
        }
    }

    private createCells() {
        return Array.from({ length: this.x }, (_, x) => new Cell(x + 1))
    }

    addPieces(team: TeamPlayer, pices: Array<Piece>) {
        
    }

    getReserveFrom(team: TeamPlayer): ReserveArea|undefined {
        return this.reserves.filter(reserve => reserve.team === team)[0]
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