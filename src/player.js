export class Player {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.isLookingLeft = false;
  }

  move(maze, stepX, stepY) {
    let canMove = true;

    switch (true) {
      case stepY === 1:
        canMove = !maze.hasWall(this.posX, this.posY + 1, this.posX + 1, this.posY + 1)
        break;
      case stepY === -1:
        canMove = !maze.hasWall(this.posX, this.posY, this.posX + 1, this.posY)
        break;
      case stepX === 1:
        canMove = !maze.hasWall(this.posX + 1, this.posY, this.posX + 1, this.posY + 1)
        this.isLookingLeft = false;
        break;
      case stepX === -1:
        canMove = !maze.hasWall(this.posX, this.posY, this.posX, this.posY + 1)
        this.isLookingLeft = true;
        break;
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

    return canMove;
  }
}
