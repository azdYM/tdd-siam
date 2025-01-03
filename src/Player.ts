import { IPlayerManager } from "./Game.js";

export class PlayerManager implements IPlayerManager {
    constructor(private input: PlayerInputInterface) {}

    async execute(): Promise<PlayerInterface | undefined> {
        return await this.input.load()
    }
}

export interface PlayerInputInterface {
    load(): Promise<PlayerInterface | undefined>
}

export interface PlayerInterface {}

export class Player {}