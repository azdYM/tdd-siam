import { BoardInterface } from "./Board.js"
import { DisplayInterface } from "./GameSession.js"
import { PlayerInterface } from "./Player.js"

export class DisplayLog implements DisplayInterface {
    messages: String[] = []

    onBoardNotProvided(): void {
        this.messages.push("Le plateau de jeu n'a pas été fourni")
    }
    
    onBoardSynchronized(players: PlayerInterface[], board: BoardInterface): void {
        this.messages.push("Les pièces des deux équipes ont été syncronisé au plateau du jeu")
    }
}
