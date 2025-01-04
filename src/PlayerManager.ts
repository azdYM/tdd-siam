import { IPlayerManager } from "./Game.js"
import { Player, PlayerInterface, TeamPlayer } from "./Player.js"

export type PlayerEntries = {
    name?: string
    team?: TeamPlayer
}

export class PlayerManager implements IPlayerManager {
    constructor(private input: PlayerInputInterface) {}

    async execute(numberOfPiecesPerPlayer: number): Promise<PlayerInterface | undefined> {
        const data = await this.input.load()
        if (data) {
            return new Player().configure(data.name, data.team, numberOfPiecesPerPlayer)
        }
    }
}

export interface PlayerInputInterface {
    load(): Promise<PlayerEntries | undefined>
}

