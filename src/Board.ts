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

    addPiecesInReserveTeam(team: TeamPlayer, pieces: Array<Piece>) {
        const cells = this.getReserveFrom(team)?.cells
        cells?.forEach((cell, key) => cell.setPiece(pieces[key]))
    }

    getReserveFrom(team: TeamPlayer): ReserveArea|undefined {
        return this.reserves.find(reserve => reserve.team === team)
    }
}

export class Cell {
    private piece: Piece|null = null
    constructor(
        public id: number,
    ) {}

    setPiece(piece: Piece) {
        this.piece = piece
    }

    getPiece() {
        return this.piece
    }

    isEmpty() {
        return this.piece === null
    }
}