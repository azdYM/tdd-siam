import { Board, Game, Player } from "./Game.js";

test('Initialize the game without a board and return null', () => {
    const game = new Game()
    expect(game.getBoard()).toBeNull()
});

test('Initialize a 1D board with 5 cells', () => {
    const game = new Game()
    game.setBoard(new Board(5))
    expect(game.getBoard()?.size()).toBe(5) 
});

test('Initialize a 2D board with 5x5 cells', () => {
    const game = new Game()
    game.setBoard(new Board(5, 5))
    expect(game.getBoard()?.size()).toBe(25) 
});

test('Return an empty player list when no players are Added', () => {
    const game = new Game()
    game.setBoard(new Board(5, 5))

    expect(game.getPlayers()).toEqual([]) 
});

test('Initialize the game with a single player', () => {
    const player = new Player()
    const game = new Game()

    game.setBoard(new Board(5, 5))
    game.addPlayer(player)

    expect(game.getPlayers()).toEqual([player]) 
});

test('Initialize the game with multiple players', () => {
    const player = new Player()
    const player2 = new Player()
    const game = new Game()

    game.setBoard(new Board(5, 5))
    game.addPlayer(player)
    game.addPlayer(player2)

    expect(game.getPlayers()).toEqual([player, player2]) 
});



