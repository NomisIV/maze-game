export class Player {
  constructor() {
    this.posX = 0;
    this.posY = 0;
  }

  move(maze, stepX, stepY) {
    let canMove = false;

    if (stepY === 1) {
      canMove = maze.hasWall(this.posX, this.posY + 1, this.posX + 1, this.posY + 1)
    } else if (stepY === -1) {
      canMove = maze.hasWall(this.posX, this.posY - 1, this.posX + 1, this.posY - 1)
    } else if (stepX === 1) {
      canMove = maze.hasWall(this.posX + 1, this.posY, this.posX + 1, this.posY + 1)
    } else if (stepX === -1) {
      canMove = maze.hasWall(this.posX - 1, this.posY, this.posX - 1, this.posY + 1)
    }

    const newPosX = this.posX + stepX
    const newPosY = this.posY + stepY

    if (!(newPosX >= 0 && newPosX < maze.width && newPosY >= 0 && newPosY < maze.height)) {
      canMove = false
    }

    if (canMove) {
      this.posX = newPosX
      this.posY = newPosY
    }
  }
}
