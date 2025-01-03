import { Game } from './Game.js'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    
  </div>
`

const game = new Game(/** passer des collaborateurs */)
game.start()
