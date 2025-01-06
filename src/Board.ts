import { Cell } from "./Cell.js"
import { Piece } from "./Piece.js"
import { PiecesPerTeam, TeamPlayer } from "./Player.js"

type ReserveArea = {
    team: TeamPlayer,
    cells: Cell[]
}

export interface BoardInterface {
    setPiecesForTeams(piecesPerTeam: Array<PiecesPerTeam>): void
    size(): number
    getReserveFrom(team: TeamPlayer): ReserveArea|undefined
}

export class Board implements BoardInterface {
    private reserves: ReserveArea[] = []
    constructor(private x: number, private y: number = 1) {}

    setPiecesForTeams(piecesPerTeam: Array<PiecesPerTeam>) {
        for (const {team, pieces} of piecesPerTeam) {
            this.reserves.push({team, cells: this.createCells()})
            this.addPiecesInReserveTeam(team, pieces)
        }
    }

    getReserveFrom(team: TeamPlayer): ReserveArea|undefined {
        return this.reserves.find(reserve => reserve.team === team)
    }

    size() {
        return this.x * this.y
    }

    private createCells() {
        return Array.from({ length: this.x }, (_, x) => new Cell(x + 1))
    }

    private addPiecesInReserveTeam(team: TeamPlayer, pieces: Piece[]) {
        const cells = this.getReserveFrom(team)?.cells
        cells?.forEach((cell, key) => cell.setPiece(pieces[key]))
    }
}
