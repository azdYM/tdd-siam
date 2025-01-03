import { Board, BoardInputInterface, BoardInterface, BoardManager } from "./Board.js";
import { Game, Player } from "./Game.js";

class BoardInputTest implements BoardInputInterface {
    constructor(private board: BoardInterface) {}

    async load(): Promise<BoardInterface | undefined> {
        return this.board
    }
}

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

test('Initialize the game with a single player', () => {
    const player = new Player()
    const game = new Game()
    game.addPlayer(player)

    expect(game.getPlayers()).toEqual([player]) 
});

test('Initialize the game with multiple players', () => {
    const player = new Player()
    const player2 = new Player()
    const game = new Game()

    game.addPlayer(player)
    game.addPlayer(player2)

    expect(game.getPlayers()).toEqual([player, player2]) 
});



