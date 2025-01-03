import { Board, Game } from "./Game.js";

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


