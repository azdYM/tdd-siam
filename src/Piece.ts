import { TeamPlayer } from "./Player.js";

export type PieceType = TeamPlayer

export class PieceFactory {
    static create(type: PieceType, id: number): Piece {
        return new Piece(id, type);
    }
}

export class Piece {
    static ELEPHANT: PieceType = 'Elephant'
    static RHINOCEROS: PieceType = 'Rhinoceros'

    constructor(
        public id: number,
        public type: TeamPlayer
    ) {}
}