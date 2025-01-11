import { Board } from "../Board.js";
import { BoardManager } from "../BoardManager.js";
import { Cell } from "../Cell.js";
import { BoardInputTest } from "./game.test.js";
import { Piece, PieceFactory } from "../Piece.js";

test('should not create reserves for any team if no players are defined', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)
    const board = await boardManager.execute()

    expect(board?.getReserveFor(Piece.ELEPHANT)).toBeUndefined()
    expect(board?.getReserveFor(Piece.RHINOCEROS)).toBeUndefined()
});

test('should create reserves with correct number of cells when team players are defined', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.synchronize([
        {team: "Elephant", pieces: []},
        {team: "Rhinoceros", pieces: []}
    ])

    expect(board?.getReserveFor(Piece.ELEPHANT)?.cells.length).toBe(5)
    expect(board?.getReserveFor(Piece.RHINOCEROS)?.cells.length).toBe(5) 
});

test('reserve cells should all be instances of the Cell class', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.synchronize([
        {team: "Elephant", pieces: []},
        {team: "Rhinoceros", pieces: []}
    ])
    expect(board?.getReserveFor('Elephant')?.cells.every(reserve => reserve instanceof Cell)).toBe(true)
    expect(board?.getReserveFor('Rhinoceros')?.cells.every(reserve => reserve instanceof Cell)).toBe(true)
});

test('reserve cells should be empty when no player pieces are added', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.synchronize([
        {team: "Elephant", pieces: []},
        {team: "Rhinoceros", pieces: []}
    ])

    expect(board?.getReserveFor('Elephant')?.cells.every(reserve => reserve.isEmpty())).toBe(true)
    expect(board?.getReserveFor('Rhinoceros')?.cells.every(reserve => reserve.isEmpty())).toBe(true)

});

test('reserve cells should contain pieces after adding player pieces', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board.synchronize(loadPiecesPerTeam())

    expect(board?.getReserveFor('Elephant')?.cells.every(reserve => reserve.isEmpty())).toBe(false)
});

test('should place pieces in the correct cells with in a reserve', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)
    const piecesPerTeam = loadPiecesPerTeam()

    const board = await boardManager.execute() as Board
    board.synchronize(loadPiecesPerTeam())

    expect(board?.getReserveFor(Piece.ELEPHANT)?.cells[0].getPiece()).toStrictEqual(piecesPerTeam[0].pieces[0])
    expect(board?.getReserveFor(Piece.RHINOCEROS)?.cells[4].getPiece()).toStrictEqual(piecesPerTeam[1].pieces[4])
});

test("The board's play area should contain the correct number of cells, all initialized as empty.", async () => {
    const inputPlayer = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(inputPlayer)

    const board = await boardManager.execute() as Board
    expect(board.getPlayArea().length).toBe(board.size())
    expect(board.getPlayArea().every(cell => cell.isEmpty())).toBe(true)
});

test("play area should initialize cell positions correctly, the first cell at (1, 1) and the last at (5, 5) for a 5x5 board.", async () => {
    const inputPlayer = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(inputPlayer)

    const board = await boardManager.execute() as Board;    

    expect(board.getPlayArea()[0].getPosition()).toEqual({x: 1, y: 1})
    expect(board.getPlayArea()[6].getPosition()).toEqual({x: 2, y: 2})
    expect(board.getPlayArea()[24].getPosition()).toEqual({x: 5, y: 5})
});


test('The board should place three rockets in the center cells of the play area after synchronization.', async () => {
    const inputPlayer = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(inputPlayer)

    const board = await boardManager.execute() as Board
    board.synchronize([])
    
    const centerCells = board.getPlayArea().filter(cell => 
        cell.getPosition()!.x >= 3 && cell.getPosition()!.x <= 3 &&
        cell.getPosition()!.y >= 2 && cell.getPosition()!.y <= 4
    )
    const nonCentralCells = board.getPlayArea().filter(cell => !centerCells.includes(cell));

    expect(centerCells.every(cell => cell.getPiece()?.type === Piece.ROCK)).toBe(true)
    expect(nonCentralCells.every(cell => cell.isEmpty())).toBe(true);
});

function loadPiecesPerTeam(length: number = 5) {
    const elephantPieces = Array.from({ length }, (_, x) => PieceFactory.create(Piece.ELEPHANT, `E${x + 1}`));
    const rhinocerosPieces = Array.from({ length }, (_, x) => PieceFactory.create(Piece.RHINOCEROS, `R${x + 1}`));
    
    return [
        {team: Piece.ELEPHANT, pieces: elephantPieces},
        {team: Piece.RHINOCEROS, pieces: rhinocerosPieces}
    ]
}