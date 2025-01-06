import { TeamPlayer } from "./Player.js";

export type PieceType = TeamPlayer | 'Rock'

export class PieceFactory {
    static create(type: PieceType, id: number): Piece {
        return new Piece(id, type);
    }
}

export class Piece {
    static ELEPHANT: TeamPlayer = 'Elephant'
    static RHINOCEROS: TeamPlayer = 'Rhinoceros'
    static ROCK: PieceType = 'Rock'

    constructor(
        public id: number,
        public type: PieceType
    ) {}
}