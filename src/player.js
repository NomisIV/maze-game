export class Player {
    constructor(x, y) {
        this.posX = x;
        this.posY = y;
        this.direction = "right";
        this.hasAmmunition = false;
        this.isDead = false;
    }

    move(maze, stepX, stepY) {
        let canMove = true;

        switch (true) {
            case stepY === 1:
                canMove = !maze.hasWall(this.posX, this.posY + 1, this.posX + 1, this.posY + 1)
                this.direction = "down";
                break;
            case stepY === -1:
                canMove = !maze.hasWall(this.posX, this.posY, this.posX + 1, this.posY)
                this.direction = "up";
                break;
            case stepX === 1:
                canMove = !maze.hasWall(this.posX + 1, this.posY, this.posX + 1, this.posY + 1)
                this.direction = "right";
                break;
            case stepX === -1:
                canMove = !maze.hasWall(this.posX, this.posY, this.posX, this.posY + 1)
                this.direction = "left";
                break;
        }

        if (canMove) {
            this.posX += stepX;
            this.posY += stepY;
        }

        return canMove;
    }

    fireGun(minotaur, maze) {
        if (!this.hasAmmunition || this.isDead) return;

        let x = this.posX;
        let y = this.posY;
        for (let i = 0; i < 100; i++) {
            console.info(x, y, minotaur.posX, minotaur.posY);

            if (minotaur.posX === x && minotaur.posY === y && !minotaur.isDead) {
                minotaur.isDead = true;
                break;
            }

            let blocked = false;
            switch (this.direction) {
                case "down":
                    blocked = maze.hasWall(x, y + 1, x + 1, y + 1);
                    y += 1;
                    break;
                case "up":
                    blocked = maze.hasWall(x, y, x + 1, y);
                    y -= 1;
                    break;
                case "right":
                    blocked = maze.hasWall(x + 1, y, x + 1, y + 1);
                    x += 1;
                    break;
                case "left":
                    blocked = maze.hasWall(x, y, x, y + 1);
                    x -= 1;
                    break;
            }
            if (blocked) break;
        }

    }
}
