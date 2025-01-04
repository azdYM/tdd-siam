import { Piece, PieceFactory } from "./Piece.js"

export interface PlayerInterface {}

export type TeamPlayer = 'Elephant' | 'Rhinoceros'

export class Player implements PlayerInterface {
    name?: string 
    team?: TeamPlayer
    private pieces: Piece[] = []
    
    configure(name: string = "", team?: TeamPlayer, numberOfPiecesPerPlayer: number = 0) {
        this.validate(team)
        this.name = name;
        this.team = team;
        
        this.pieces = this.createPieces(numberOfPiecesPerPlayer)
        return this;
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
            (_, id) => PieceFactory.create(this.team!, id)
        )
    }
}


