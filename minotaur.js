export class Minotaur {
  constructor() {
    this.posX = 0;
    this.posY = 0;
  }

  stepTowardsPlayer(player, maze) {
    const [x, y] = this._aStar(maze, player.posX, player.posY, this.posX, this.posX)[0]
    this.posX = x
    this.posY = y
  }

  _aStar(maze, targetPosX, targetPosY, posX, posY) {
    
  }
}


