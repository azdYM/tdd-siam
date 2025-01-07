import { BoardInterface } from "./Board.js"
import { BoardInputInterface, BoardManager } from "./BoardManager.js"
import { DisplayLog } from "./DisplayLog.js"
import { GameRules } from "./GameRules.js"
import { GameSession, PlayerGameInputsInterface } from "./GameSession.js"
import { PiecesPerTeam, PlayerInterface } from "./Player.js"
import { PlayerConfigInputInterface, PlayerManager } from "./PlayerManager.js"

export interface IBoardManager {
    execute(): Promise<BoardInterface | undefined>
}

export interface IPlayerManager {
    execute(numberOfPiecesPerPlayer: number): Promise<PlayerInterface | undefined>
}

export interface SessionInterface {
    start(board: BoardInterface, players: PlayerInterface[]): Promise<void>
    getPlayers(): PlayerInterface[]
    getBoard(): BoardInterface
    status(): Array<string>
}

export interface DisplayInterface {
    boardSynchronized(players: PlayerInterface[], board: BoardInterface): void
}

export class Game {
    private board: BoardInterface | null = null
    private players: PlayerInterface[] = []
    private NUMBER_OF_PIECES_PER_PLAYER = 7

    constructor(
        private boardManager?: IBoardManager,
        private playerManager?: IPlayerManager,
        private session?: SessionInterface,
        private display?: DisplayInterface
    ) {}

    async start() {
        await this.initBoard()
        await this.initPlayers()
        await this.board?.synchronize(this.getPiecesForTeams())
        this.display?.boardSynchronized(this.players, this.board!)
        this.session?.start(this.board!, this.players)
    }

    private async initBoard() {
        this.board = await this.boardManager?.execute() ?? null
    }

    private async initPlayers() {
        let player: PlayerInterface | undefined = undefined

        do {
            player = await this.playerManager?.execute(this.NUMBER_OF_PIECES_PER_PLAYER)
            if (player) {
                this.players.push(player)
            }
        } while (player !== undefined);
    }

    private getPiecesForTeams(): PiecesPerTeam[] {
        return this.players.map(player => ({
            team: player.getTeam(), 
            pieces: player.getPieces()
        }))
    }
}

export async function startGame(
    boardInput?: BoardInputInterface, 
    playerConfigInput?: PlayerConfigInputInterface, 
    playerGameInput?: PlayerGameInputsInterface
) {
    
    let playersManager: IPlayerManager | undefined
    let boardManager: IBoardManager | undefined

    if (boardInput) {
        boardManager = new BoardManager(boardInput)
    }

    if (playerConfigInput) {
        playersManager = new PlayerManager(playerConfigInput)
    }

    const log = new DisplayLog()
    const gameRules = new GameRules
    const session = new GameSession(gameRules, playerGameInput)

    const game = new Game(boardManager, playersManager, session, log)
    await game.start()

    return { session, rules: gameRules, log  }
}