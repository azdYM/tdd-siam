import { BoardInterface } from "./Board.js";
import { DisplayInterface, GameRulesInterface } from "./GameSession.js";
import { PiecesPerTeam, PlayerInterface } from "./Player.js";
import { SessionInterface } from "./Game.js";

export abstract class AbstractGameSession implements SessionInterface {
    protected board: BoardInterface
    protected players: PlayerInterface[] = []

    protected constructor(
        protected gameRules: GameRulesInterface, 
        protected display?: DisplayInterface
    ) {}

    abstract start(board?: BoardInterface, players?: PlayerInterface[]): Promise<void>;

    abstract status(): Promise<string[]>;

    getBoard(): BoardInterface {
        return this.board
    }

    getPlayers(): PlayerInterface[] {
        return this.players
    }

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