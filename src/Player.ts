import { Piece, PieceFactory } from "./Piece.js"

export interface PlayerInterface {
    getTeam(): TeamPlayer
    getPieces(): Piece[]
}

export type TeamPlayer = 'Elephant' | 'Rhinoceros'
export type PiecesPerTeam = {
    team: TeamPlayer,
    pieces: Piece[]
}

export class Player implements PlayerInterface {
    name?: string 
    team: TeamPlayer
    private pieces: Piece[] = []
    
    configure(name: string = "", team?: TeamPlayer, numberOfPiecesPerPlayer: number = 0) {
        this.validate(team)
        this.name = name;
        this.team = team!;
        
        this.pieces = this.createPieces(numberOfPiecesPerPlayer)
        return this;
    }

    getTeam(): TeamPlayer {
        return this.team
    }

    getPieces() {
        return this.pieces
    }

    private validate(team?: string) {
        if (team && !['Elephant', 'Rhinoceros'].includes(team)) {
            throw new Error(`Invalid team: ${team}. Must be "Elephan" or "Rinhoceros".`);
        }
    }

    private createPieces(numberOfPieces: number) {
        return Array.from(
            { length: numberOfPieces }, 
            (_, index) => PieceFactory.create(this.team!, `${this.team?.substring(0, 1)}${index + 1}`)
        )
    }
}


