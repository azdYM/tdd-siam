import { Game } from "./Game.js";
import { Board, BoardInputInterface, BoardInterface, BoardManager } from "./Board.js";
import { Player, PlayerInputInterface, PlayerInterface, PlayerManager } from "./Player.js";

test('Initialize the game without a board and return null', () => {
    const game = new Game()
    expect(game.getBoard()).toBeNull()
});

test('Initialize a 1D board with 5 cells', async () => {
    const input = new BoardInputTest(new Board(5))
    const game = new Game(new BoardManager(input))

    await game.setBoard()
    expect(game.getBoard()?.size()).toBe(5) 
});

test('Initialize a 2D board with 5x5 cells', async () => {
    const input = new BoardInputTest(new Board(5, 5))
    const game = new Game(new BoardManager(input))

    await game.setBoard()
    expect(game.getBoard()?.size()).toBe(25) 
});

test('Return an empty player list when no players are Added', () => {
    const game = new Game()
    expect(game.getPlayers()).toEqual([]) 
});

test('Initialize the game with a single player', async () => {
    const player = new Player()
    const inputBoard = new MultiPlayerInputTest([player])
    const inputPlayer = new BoardInputTest(new Board(5, 5))

    const game = new Game(
        new BoardManager(inputPlayer),
        new PlayerManager(inputBoard)
    )

    await game.addPlayer()
    expect(game.getPlayers()).toEqual([player]) 
});

test('Initialize the game with multiple players', async () => {
    const player = new Player()
    const player2 = new Player()
    const inputBoard = new MultiPlayerInputTest([player, player2])
    const inputPlayer = new BoardInputTest(new Board(5, 5))

    const game = new Game(
        new BoardManager(inputPlayer),
        new PlayerManager(inputBoard)
    )

    await game.addPlayer()
    expect(game.getPlayers()).toEqual([player, player2]) 
});



class BoardInputTest implements BoardInputInterface {
    constructor(private board: BoardInterface) {}

    async load(): Promise<BoardInterface | undefined> {
        return this.board
    }
}

class MultiPlayerInputTest implements PlayerInputInterface {
    constructor(private players: Player[]) {}

    async load(): Promise<PlayerInterface | undefined> {
        return this.players.shift()
    }
}
