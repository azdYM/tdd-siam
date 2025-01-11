import { BoardInterface } from "./Board.js"
import { BoardInputInterface, BoardManager } from "./BoardManager.js"
import { DisplayLog } from "./DisplayLog.js"
import { GameRules } from "./GameRules.js"
import { GameSession } from "./GameSession.js"
import { PlayerInterface } from "./Player.js"
import { IPlayerTurnInputs, PlayerTurnManager } from "./PlayerTurnManager.js"
import { PlayerConfigInputInterface, PlayerManager } from "./PlayerManager.js"
import { GameConfig, IBoardManager, IPlayerManager } from "./GameConfig.js"

export interface SessionInterface {
    start(config: Config): Promise<void>
    status(): Promise<string[]>
}

export interface ConfigManagerInterface {
    initialize(): Promise<Config>
}

export type Config = {
    board: BoardInterface | undefined,
    players: PlayerInterface[]
}

export class Game {
    constructor(
        private configMangager: ConfigManagerInterface,
        private session: SessionInterface,
    ) {}

    async start() {
        const config = await this.configMangager.initialize()
        this.session.start(config)
    }    
}

export async function startGame(
    boardInput?: BoardInputInterface, 
    playerConfigInput?: PlayerConfigInputInterface, 
    playerTurnInputs?: IPlayerTurnInputs
) {
    
    let playersManager: IPlayerManager | undefined
    let boardManager: IBoardManager | undefined

    if (boardInput) {
        boardManager = new BoardManager(boardInput)
    }

    if (playerConfigInput) {
        playersManager = new PlayerManager(playerConfigInput)
    }

    const config = new GameConfig(boardManager, playersManager)
    const display = new DisplayLog()
    const gameRules = new GameRules
    
    const playerAction = new PlayerTurnManager(playerTurnInputs)
    const session = new GameSession(gameRules, display, playerAction)

    const game = new Game(config, session)
    await game.start()

    return { 
        config, 
        session, 
        rules: gameRules, 
        log: display  
    }
}