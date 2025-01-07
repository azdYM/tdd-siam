import { Game } from "./Game.js";
import { Board, BoardInterface } from "./Board.js";
import { PlayerEntries, PlayerInputInterface, PlayerManager } from "./PlayerManager.js";
import { BoardInputInterface, BoardManager } from "./BoardManager.js";
import { createPlayerManager } from "./player-manager.test.js";
import { Piece } from "./Piece.js";

test('Initialize the game without a board and return Null', () => {
    const game = new Game()
    expect(game.getBoard()).toBeNull()
});

test('Initialize a 1D board with 5 cells', async () => {
    const input = new BoardInputTest(new Board(5))
    const game = new Game(new BoardManager(input))

    await game.start()
    expect(game.getBoard()?.size()).toBe(5) 
});

test('Initialize a 2D board with 5x5 cells', async () => {
    const input = new BoardInputTest(new Board(5, 5))
    const game = new Game(new BoardManager(input))

    await game.start()
    expect(game.getBoard()?.size()).toBe(25) 
});

test('Return an empty player list when no players are Added', () => {
    const game = new Game()
    expect(game.getPlayers()).toEqual([]) 
});

test('Initialize the game with a single player', async () => {
    const player: PlayerEntries = {name: "Azad", team: 'Elephant'}
    const inputPlayers = new MultiPlayerInputTest([player])
    const inputBoard = new BoardInputTest(new Board(5, 5))

    const game = new Game(
        new BoardManager(inputBoard),
        new PlayerManager(inputPlayers)
    )

    await game.start()
    expect(game.getPlayers().length).toBe(1) 
});

test('Initialize the game with multiple players', async () => {
    const player = {}
    const player2 = {}
    const inputBoard = new MultiPlayerInputTest([player, player2])
    const inputPlayer = new BoardInputTest(new Board(5, 5))

    const game = new Game(
        new BoardManager(inputPlayer),
        new PlayerManager(inputBoard)
    )

    await game.start()
    expect(game.getPlayers().length).toBe(2) 
});

test('Synchronises player pieces into their respective team reserves at game start', async () => {
    const players = getPlayersEntry()
    const playersManager = await createPlayerManager(players)
    const game = new Game(
        new BoardManager(new BoardInputTest(new Board(5, 5))),
        playersManager
    )

    await game.start()
    const elephantReserve = game.getBoard()?.getReserveFor('Elephant')
    const rhinoReserve = game.getBoard()?.getReserveFor('Rhinoceros')

    
    expect(elephantReserve?.cells.every(cell => cell.isEmpty())).toBe(false)
    expect(rhinoReserve?.cells.every(cell => cell.isEmpty())).toBe(false)

    // Vérifie que les bonnes pièces ont été synchronisées
    expect(elephantReserve?.cells.every(cell => cell.getPiece()?.type === Piece.ELEPHANT)).toBe(true)
    expect(rhinoReserve?.cells.every(cell => cell.getPiece()?.type === Piece.RHINOCEROS)).toBe(true)

    // Vérifie que le nombre de pièces correspond à la taille de la réserve
    expect(elephantReserve?.cells.length).toBe(5)
    expect(rhinoReserve?.cells.length).toBe(5)

    expect(game.messages()).toBe("Les pièces des deux équipes ont été syncronisé au plateau du jeu") 
});

test('Syncronise rock pieces in the middle board', async () => {
    const inputBoard = new BoardInputTest(new Board(5, 5))
    const boardManager = new BoardManager(inputBoard)

    const game = new Game(boardManager, await createPlayerManager([]))
    await game.start()

    expect(game.status()).toEqual([
        'E E E E E',
        'E E E E E',
        'E O O O E',
        'E E E E E',
        'E E E E E',
    ])
});

test('Request possible move options during the first two turns from reserve', async () => {
    const players = getPlayersEntry()
    const playersManager = await createPlayerManager(players)
    const game = new Game(
        new BoardManager(new BoardInputTest(new Board(5, 5))),
        playersManager
    )

    await game.start()

    const player = game.getPlayers()[0]
    const piece = player?.getPieces()[0]
    const cell = game.getBoard()?.getReserveFor(player?.getTeam())?.cells[0]!

    const expectedCellsId = [1, 2, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 24, 25]
    const moves = game.getMovesOptions(piece, cell, 1);

    expect(moves?.length).toBe(expectedCellsId.length)
    expect(moves?.every(cell => expectedCellsId.includes(cell.id))).toBe(true)
    expect(cell?.getPiece()).toBe(piece)
});

test('Request set of possible move options after the second turn from reserve', async () => {
    const players = getPlayersEntry()
    const playersManager = await createPlayerManager(players)
    const game = new Game(
        new BoardManager(new BoardInputTest(new Board(5, 5))),
        playersManager
    )
    
    await game.start()

    const player = game.getPlayers()[0]
    const piece = player?.getPieces()[0]
    const cell = game.getBoard()?.getReserveFor(player?.getTeam())?.cells[0]!

    const expectedCellsId = [1, 2, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 24, 25, 3, 23]
    const moves = game.getMovesOptions(piece, cell, 3);

    expect(moves?.length).toBe(expectedCellsId.length)
    expect(moves?.every(cell => expectedCellsId.includes(cell.id))).toBe(true)
    expect(cell?.getPiece()).toBe(piece)
});

function getPlayersEntry() {
    const player: PlayerEntries = {name: "azad", team: 'Elephant'}
    const player2: PlayerEntries = {name: "mina", team: 'Rhinoceros'}

    return [player, player2]
}

export class BoardInputTest implements BoardInputInterface {
    constructor(private board: BoardInterface) {}

    async load(): Promise<BoardInterface | undefined> {
        return this.board
    }
}

export class MultiPlayerInputTest implements PlayerInputInterface {
    constructor(private dataPlayers: PlayerEntries[]) {}

    async load(): Promise<PlayerEntries | undefined> {
        return this.dataPlayers.shift()
    }
}

