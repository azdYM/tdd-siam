import { startGame, Game } from "./Game.js";
import { Board, BoardInterface } from "./Board.js";
import { PlayerEntries, PlayerConfigInputInterface, PlayerManager } from "./PlayerManager.js";
import { BoardInputInterface, BoardManager } from "./BoardManager.js";
import { Piece } from "./Piece.js";
import { EntriesPlayer, PlayerGameInputsInterface } from "./GameSession.js";

test('Initialize the game without a board and return Null', async () => {
    const { session } = await startGame()
    expect(session.getBoard()).toBeNull()
});

test('Initialize a 1D board with 5 cells', async () => {
    const boardInput = new BoardInputTest(new Board(5))
    const { session } = await startGame(boardInput)
    
    expect(session.getBoard()?.size()).toBe(5) 
});

test('Initialize a 2D board with 5x5 cells', async () => {
    const boardInput = new BoardInputTest(new Board(5, 5))
    const { session } = await startGame(boardInput)
    
    expect(session.getBoard()?.size()).toBe(25) 
});

test('Return an empty player list when no players are Added', async () => {
    const { session } = await startGame()
    expect(session.getPlayers()).toEqual([]) 
});

test('Initialize the game with a single player', async () => {
    const player: PlayerEntries = {name: "Azad", team: 'Elephant'}
    const inputPlayer = new MultiPlayerConfigInputTest([player])
    const inputBoard = new BoardInputTest(new Board(5, 5))

    const { session } = await startGame(inputBoard, inputPlayer)
    expect(session.getPlayers().length).toBe(1) 
});

test('Initialize the game with multiple players', async () => {
    const player = {}
    const player2 = {}
    const inputPlayers = new MultiPlayerConfigInputTest([player, player2])
    const inputBoard = new BoardInputTest(new Board(5, 5))

    const { session } = await startGame(inputBoard, inputPlayers)
    expect(session.getPlayers().length).toBe(2) 
});

test('Synchronises player pieces into their respective team reserves at game start', async () => {
    const playersConf = getPlayersConfig()    
    
    const inputPlayers = new MultiPlayerConfigInputTest(playersConf)
    const inputBoard = new BoardInputTest(new Board(5, 5))

    const { session, log } = await startGame(inputBoard, inputPlayers)

    const elephantReserve = session.getBoard()?.getReserveFor('Elephant')
    const rhinoReserve = session.getBoard()?.getReserveFor('Rhinoceros')

    
    expect(elephantReserve?.cells.every(cell => cell.isEmpty())).toBe(false)
    expect(rhinoReserve?.cells.every(cell => cell.isEmpty())).toBe(false)

    // Vérifie que les bonnes pièces ont été synchronisées
    expect(elephantReserve?.cells.every(cell => cell.getPiece()?.type === Piece.ELEPHANT)).toBe(true)
    expect(rhinoReserve?.cells.every(cell => cell.getPiece()?.type === Piece.RHINOCEROS)).toBe(true)

    // Vérifie que le nombre de pièces correspond à la taille de la réserve
    expect(elephantReserve?.cells.length).toBe(5)
    expect(rhinoReserve?.cells.length).toBe(5)

    expect(log.messages[0]).toBe("Les pièces des deux équipes ont été syncronisé au plateau du jeu") 
});

test('Syncronise rock pieces in the middle board', async () => {
    const inputBoard = new BoardInputTest(new Board(5, 5))
    const { session } = await startGame(inputBoard)

    expect(session.status()).toEqual([
        'E E E E E',
        'E E E E E',
        'E O O O E',
        'E E E E E',
        'E E E E E',
    ])
});

test('Request possible move options during the first two turns from reserve', async () => {
    const playersConfig = getPlayersConfig()
    const playersConfigInput = new MultiPlayerConfigInputTest(playersConfig)
    const boardConfigInput = new BoardInputTest(new Board(5, 5))
    const playerGameInput = new PlayerGameInput([{pieceId: 1, currentCellId: 1, area: 'Reserve'}])

    const { session, rules } = await startGame(
        boardConfigInput, 
        playersConfigInput, 
        playerGameInput
    )

    const player = session.getPlayers()[0]
    const piece = player?.getPieces()[0]
    const cell = session.getBoard()?.getReserveFor(player?.getTeam())?.cells[0]!

    const expectedCellsId = [1, 2, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 24, 25]
    const moves = await rules.fetchMoveOptions(piece, cell, 1)

    expect(moves?.length).toBe(expectedCellsId.length)
    expect(moves?.every(cell => expectedCellsId.includes(cell.id))).toBe(true)
    expect(cell?.getPiece()).toBe(piece)
});

test('Request set of possible move options after the second turn from reserve', async () => {
    const playersConfig = getPlayersConfig()
    const playersConfigInput = new MultiPlayerConfigInputTest(playersConfig)
    const boardConfigInput = new BoardInputTest(new Board(5, 5))
    const playerGameInput = new PlayerGameInput([{pieceId: 1, currentCellId: 1, area: 'Reserve'}])

    const { session, rules } = await startGame(
        boardConfigInput, 
        playersConfigInput, 
        playerGameInput
    )

    const player = session.getPlayers()[0]
    const piece = player?.getPieces()[0]
    const cell = session.getBoard()?.getReserveFor(player?.getTeam())?.cells[0]!

    const expectedCellsId = [1, 2, 4, 5, 6, 10, 11, 15, 16, 20, 21, 22, 24, 25, 3, 23]
    const moves = await rules.fetchMoveOptions(piece, cell, 3)

    expect(moves?.length).toBe(expectedCellsId.length)
    expect(moves?.every(cell => expectedCellsId.includes(cell.id))).toBe(true)
    expect(cell?.getPiece()).toBe(piece)
});

function getPlayersConfig() {
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

export class MultiPlayerConfigInputTest implements PlayerConfigInputInterface {
    constructor(private dataPlayers: PlayerEntries[]) {}

    async load(): Promise<PlayerEntries | undefined> {
        return this.dataPlayers.shift()
    }
}

export class PlayerGameInput implements PlayerGameInputsInterface {
    constructor(private entiries: EntriesPlayer[]) {}

    async previewMoves() {
        return this.entiries.shift()
    }
}