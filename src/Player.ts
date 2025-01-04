import { IPlayerManager } from "./Game.js";

export interface PlayerInterface {}

export type TeamPlayer = 'Elephant' | 'Rhinoceros'

export class Player implements PlayerInterface {
    public name?: string 
    public team?: TeamPlayer
    private pieces: Piece[] = []
    
    configure(name: string = "", team?: TeamPlayer, numberOfPiecesPerPlayer: number = 0) {
        if (team && !['Elephant', 'Rhinoceros'].includes(team)) {
            throw new Error(`Invalid team: ${team}. Must be "Elephan" or "Rinhoceros".`);
        }

        this.name = name;
        this.team = team;

        this.pieces = team
            ? Array.from({ length: numberOfPiecesPerPlayer }, (_, id) => new Piece(id, team))
            : [];
        return this;
    }

    getPieces() {
        return this.pieces
    }
}

class Piece {
    constructor(
        public id: number,
        public type: TeamPlayer
    ) {}
}


