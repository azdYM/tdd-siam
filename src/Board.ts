import { Cell } from "./Cell.js"
import { Piece } from "./Piece.js"
import { PiecesPerTeam, TeamPlayer } from "./Player.js"

type ReserveArea = {
    team: TeamPlayer,
    cells: Cell[]
}

export interface BoardInterface {
    size(): number
    synchronize(piecesPerTeam: Array<PiecesPerTeam>): Promise<void>
    getReserveFor(team: TeamPlayer): ReserveArea|undefined
    getPlayArea(): Cell[]
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
                const rock = new Piece(rockId, Piece.ROCK)
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
