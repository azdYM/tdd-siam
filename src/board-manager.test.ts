import { Board, BoardManager, Cell } from "./Board.js";
import { BoardInputTest } from "./game.test.js";
import { Piece, PieceFactory } from "./Piece.js";

test('reserves cells are empty when board should initialize without players', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute()

    expect(board?.getReserveFrom(Piece.ELEPHANT)).toBeUndefined()
    expect(board?.getReserveFrom(Piece.RHINOCEROS)).toBeUndefined()
});

test('should place player animals in their reserve at definition of player', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board?.createReservesFrom(["Elephant", "Rhinoceros"])

    expect(board?.getReserveFrom(Piece.ELEPHANT)?.cells.length).toBe(5)
    expect(board?.getReserveFrom(Piece.RHINOCEROS)?.cells.length).toBe(5) 
});

test('each place in reseve should be a cell', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board?.createReservesFrom(["Elephant", "Rhinoceros"])

    expect(board?.getReserveFrom('Elephant')?.cells.every(reserve => reserve instanceof Cell)).toBe(true)
    expect(board?.getReserveFrom('Rhinoceros')?.cells.every(reserve => reserve instanceof Cell)).toBe(true)
});

test('reserve cells should not be empty when setup player pieces', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(boardInput)

    const board = await boardManager.execute() as Board
    board?.createReservesFrom(["Elephant", "Rhinoceros"])
    board?.addPieces(
        Piece.ELEPHANT, 
        Array.from(
            {length: 5}, 
            (_, x) => PieceFactory.create(Piece.ELEPHANT, x)
        )
    )

    expect(board?.getReserveFrom('Elephant')?.cells.every(reserve => reserve.isEmpty())).toBe(false)
});


