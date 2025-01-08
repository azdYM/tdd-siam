import { Cell } from "./Cell.js"
import { Piece } from "./Piece.js"
import { PiecesPerTeam, TeamPlayer } from "./Player.js"

type ReserveArea = {
    team: TeamPlayer,
    cells: Cell[]
}

export type Area = 'Play' | 'Reserve'

export interface BoardInterface {
    size(): number
    rows(): number
    columns(): number
    synchronize(piecesPerTeam: Array<PiecesPerTeam>): Promise<void>
    getReserveFor(team: TeamPlayer): ReserveArea|undefined
    getPlayArea(): Cell[]
    getCellFor(id: number, area: Area, team?: TeamPlayer): Cell | null
}

export class Board implements BoardInterface {
    private reserves: ReserveArea[] = []
    private playArea: Cell[] = []

    constructor(private x: number, private y: number = 1) {
        this.initPlayArea()
    }

    async synchronize(piecesPerTeam: Array<PiecesPerTeam>) {
        this.initReservesTeams(piecesPerTeam)
        this.initRocketPiecesInPlayArea()
    }

    getReserveFor(team: TeamPlayer): ReserveArea|undefined {
        return this.reserves.find(reserve => reserve.team === team)
    }

    getPlayArea() {
        return this.playArea
    }

    size() {
        return this.x * this.y
    }

    rows(): number {
        return this.x
    }

    columns(): number
    {
        return this.y
    }

    getCellFor(id: number, area: Area, team?: TeamPlayer) {
        if (area === 'Play') {
            return this.getPlayArea().find(cell => cell.id === id) ?? null
        }

        if (!team) return null
        return this.getReserveFor(team)?.cells.find(cell => cell.id === id) ?? null
    }

    private initPlayArea() {
        this.playArea = this.createCells(this.size()).map((cell, key) => {
            const {x, y} = this.getPositionFromIndex(key)
            cell.setPosition(x, y)
            return cell
        })
    }

    private createCells(length: number) {
        return Array.from({ length }, (_, x) => new Cell(x + 1))
    }

    private initReservesTeams(piecesPerTeam: Array<PiecesPerTeam>) {
        for (const {team, pieces} of piecesPerTeam) {
            this.reserves.push({team, cells: this.createCells(this.x)})
            this.addPiecesInReserveTeam(team, pieces)
        }
    }

    private addPiecesInReserveTeam(team: TeamPlayer, pieces: Piece[]) {
        const cells = this.getReserveFor(team)?.cells
        cells?.forEach((cell, key) => cell.setPiece(pieces[key]))
    }

    private initRocketPiecesInPlayArea() {
        let rockId = 0
        const center = Math.floor(this.size() / 2)
        const positionsToPlaceRockets = [
            this.getPositionFromIndex(center - 1),
            this.getPositionFromIndex(center),
            this.getPositionFromIndex(center + 1),
        ];

        this.playArea.forEach(cell => {
            const { x, y } = cell.getPosition()!
            const isRocketPosition = positionsToPlaceRockets.some(pos => pos.x === x && pos.y === y)
            
            if (isRocketPosition) {
                rockId++
                const rock = new Piece(`O${rockId}`, Piece.ROCK)
                cell.setPiece(rock)
            }
        })
    }

    private getPositionFromIndex(index: number) {
        const x = Math.floor(index / this.x) + 1
        const y = index % this.y + 1

        return {x, y}
    }
}
