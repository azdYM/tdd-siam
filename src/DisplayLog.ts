import { BoardInterface } from "./Board.js"
import { DisplayInterface } from "./Game.js"
import { PlayerInterface } from "./Player.js"

export class DisplayLog implements DisplayInterface {
    messages: String[] = []

    boardSynchronized(players: PlayerInterface[], board: BoardInterface): void {
        this.messages.push("Les pièces des deux équipes ont été syncronisé au plateau du jeu")
    }
}
