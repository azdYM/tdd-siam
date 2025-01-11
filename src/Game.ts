import { BoardInterface } from "./Board.js"
import { BoardInputInterface, BoardManager } from "./BoardManager.js"
import { DisplayLog } from "./DisplayLog.js"
import { GameRules } from "./GameRules.js"
import { GameSession } from "./GameSession.js"
import { PlayerInterface } from "./Player.js"
import { PlayerAction, PlayerGameInputsInterface } from "./PlayerAction.js"
import { PlayerConfigInputInterface, PlayerManager } from "./PlayerManager.js"

export interface IBoardManager {
    execute(): Promise<BoardInterface | undefined>
}

export interface IPlayerManager {
    execute(numberOfPiecesPerPlayer: number): Promise<PlayerInterface | undefined>
}

export interface SessionInterface {
    start(board?: BoardInterface, players?: PlayerInterface[]): Promise<void>
    getPlayers(): PlayerInterface[]
    getBoard(): BoardInterface
    status(): Promise<string[]>
}

export class Game {
    private NUMBER_OF_PIECES_PER_PLAYER = 7

    constructor(
        private boardManager?: IBoardManager,
        private playerManager?: IPlayerManager,
        private session?: SessionInterface,
    ) {}

    async start() {
        const {board, players} = await this.initGame()
        this.session?.start(board, players)
    }

    private async initGame() {
        const board = await this.initBoard()
        const players = await this.initPlayers()
        return { board, players }
    }

    private async initBoard() {
        return await this.boardManager?.execute() ?? undefined
    }

    private async initPlayers() {
        const players: PlayerInterface[] = []
        let player: PlayerInterface | undefined = undefined
        
        do {
            player = await this.playerManager?.execute(this.NUMBER_OF_PIECES_PER_PLAYER)
            if (player) {
                players.push(player)
            }
        } while (player !== undefined)

        return players
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
    const playerAction = new PlayerAction(playerGameInput)
    const session = new GameSession(gameRules, log, playerAction)

    const game = new Game(boardManager, playersManager, session)
    await game.start()

    return { session, rules: gameRules, log  }
}