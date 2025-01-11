import { BoardInterface } from "./Board.js";
import { DisplayInterface, GameRulesInterface } from "./GameSession.js";
import { PiecesPerTeam, PlayerInterface } from "./Player.js";
import { Config, SessionInterface } from "./Game.js";

export abstract class AbstractGameSession implements SessionInterface {
    protected board: BoardInterface
    protected players: PlayerInterface[] = []

    protected constructor(
        protected gameRules: GameRulesInterface, 
        protected display?: DisplayInterface
    ) {}

    abstract start(gameConfig: Config): Promise<void>;

    abstract status(): Promise<string[]>;

    protected getPiecesForTeams(): PiecesPerTeam[] {
        return this.players.map(player => ({
            team: player.getTeam(), 
            pieces: player.getPieces()
        }))
    }

    protected validateBoardAndPlayers(board?: BoardInterface, players: PlayerInterface[] = []) {
        if (!board) {
            this.display?.onBoardNotProvided()
            return
        }
        
        this.board = board
        this.gameRules.setBoard(board)
        this.players = players
    }

}