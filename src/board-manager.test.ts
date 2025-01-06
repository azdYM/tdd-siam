import { Board } from "./Board.js";
import { BoardManager } from "./BoardManager.js";
import { Cell } from "./Cell.js";
import { BoardInputTest } from "./game.test.js";
import { Piece, PieceFactory } from "./Piece.js";

test('should not create reserves for any team if no players are defined', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)
    const board = await boardManager.execute()

    expect(board?.getReserveFrom(Piece.ELEPHANT)).toBeUndefined()
    expect(board?.getReserveFrom(Piece.RHINOCEROS)).toBeUndefined()
});

test('should create reserves with correct number of cells when team players are defined', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.setPiecesForTeams([
        {team: "Elephant", pieces: []},
        {team: "Rhinoceros", pieces: []}
    ])

    expect(board?.getReserveFrom(Piece.ELEPHANT)?.cells.length).toBe(5)
    expect(board?.getReserveFrom(Piece.RHINOCEROS)?.cells.length).toBe(5) 
});

test('reserve cells should all be instances of the Cell class', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.setPiecesForTeams([
        {team: "Elephant", pieces: []},
        {team: "Rhinoceros", pieces: []}
    ])
    expect(board?.getReserveFrom('Elephant')?.cells.every(reserve => reserve instanceof Cell)).toBe(true)
    expect(board?.getReserveFrom('Rhinoceros')?.cells.every(reserve => reserve instanceof Cell)).toBe(true)
});

test('reserve cells should be empty when no player pieces are added', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.setPiecesForTeams([
        {team: "Elephant", pieces: []},
        {team: "Rhinoceros", pieces: []}
    ])

    expect(board?.getReserveFrom('Elephant')?.cells.every(reserve => reserve.isEmpty())).toBe(true)
    expect(board?.getReserveFrom('Rhinoceros')?.cells.every(reserve => reserve.isEmpty())).toBe(true)

});

test('reserve cells should contain pieces after adding player pieces', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.setPiecesForTeams(loadPiecesPerTeam())

    expect(board?.getReserveFrom('Elephant')?.cells.every(reserve => reserve.isEmpty())).toBe(false)
});

test('should place pieces in the correct cells with in a reserve', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5));
    const boardManager = new BoardManager(boardInput);
    const piecesPerTeam = loadPiecesPerTeam()

    const board = await boardManager.execute() as Board;
    board.setPiecesForTeams(loadPiecesPerTeam())


    expect(board?.getReserveFrom(Piece.ELEPHANT)?.cells[0].getPiece()).toStrictEqual(piecesPerTeam[0].pieces[0]);
    expect(board?.getReserveFrom(Piece.RHINOCEROS)?.cells[4].getPiece()).toStrictEqual(piecesPerTeam[1].pieces[4]);
});


function loadPiecesPerTeam(length: number = 5) {
    const elephantPieces = Array.from({ length }, (_, x) => PieceFactory.create(Piece.ELEPHANT, x));
    const rhinocerosPieces = Array.from({ length }, (_, x) => PieceFactory.create(Piece.RHINOCEROS, x));

    return [
        {team: Piece.ELEPHANT, pieces: elephantPieces},
        {team: Piece.RHINOCEROS, pieces: rhinocerosPieces}
    ]
}