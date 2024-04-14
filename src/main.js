import { PLAYER_SPEED } from "./constants.js";
import { Graphics, drawMainMenu, loadGraphics } from "./graphics.js";
import { cellMaze, layerMaze } from "./maze.js";
import { Monster } from "./monster.js";
import { Player } from "./player.js";

class GameState {
    constructor(levelIdx) {
        this.graphics = null;
        this.keyStack = [];
        this.attempt = 0;

        switch (levelIdx % 3) {
            case 0:
                this.maze = layerMaze(17, 6, 4);
                this.levelExtra = [[Math.floor(Math.random() * 17), 0]];
                break;

            case 1:
                this.maze = cellMaze(3, 3, 8, 8);

                let pos1 = Math.floor(Math.random() * 24);
                let pos2 = Math.floor(Math.random() * 24);
                this.levelExtra = Math.random() < 0.5 ? [[pos1, 0], [pos2, 23]] : [[0, pos1], [23, pos2]];

                break;
            case 2:
                this.maze = cellMaze(6, 6, 6, 6);
    
                this.levelExtra = [];
    
                for (let i = 0; i < 10; i++) {
                    let x = 18;
                    let y = 18;
                    while (Math.hypot(x - 18, y - 18) < 8) {
                        x = Math.floor(Math.random() * this.maze.width);
                        y = Math.floor(Math.random() * this.maze.height);
                    }
                    this.levelExtra.push([x, y]);
                }
                break;
        }

        this.resetLevel();
    }

    resetLevel() {
        this.moveCooldown = 0;
        this.attempt += 1;

        let oldGraphics = this.graphics;

        switch (levelIdx % 3) {
            case 0:
                this.graphics = new Graphics("sand");
                this.player = new Player(8, 23);
                this.ammunitions = this.levelExtra.slice();
                this.monsters = [new Monster(8, 30, "minotaur", 20)];
                break;
            case 1:
                this.graphics = new Graphics("mansion");
                this.player = new Player(8, 19);
                this.ammunitions = this.levelExtra.slice();
                this.monsters = this.levelExtra.map(([x, y]) => new Monster(x, y, "bat", 32));
                break;
            case 2:
                this.graphics = new Graphics("hell");
                this.player = new Player(18, 18);
                this.player.ammunition = Infinity;
                this.ammunitions = [];
                this.monsters = this.levelExtra.map(([x, y]) => new Monster(x, y, "dog", 24));
                break;
        }

        if (oldGraphics !== null) {
            this.graphics.copyExplored(oldGraphics);
        }
    }

    draw() {
        // Game logic
        for (let i = 0; i < this.monsters.length; i++) {
            let monster = this.monsters[i];
            if (frameCount % monster.speed === 0) {
                if (!monster.isDead) {
                    let isOccupied = (x, y) => this.monsters.some((m, j) => j !== i && !m.isDead && m.posX === x && m.posY === y);
                    monster.stepTowardsPlayer(this.player, this.maze, isOccupied);
                }
            }
        }

        if (this.moveCooldown === 0 && !this.player.isDead) {
            for (let i = this.keyStack.length - 1; i >= 0; i--) {
                let dir = null;

                switch (this.keyStack[i]) {
                    case 37: // LeftArrow
                    case 65: // A
                        dir = [-1, 0];
                        break;
                    case 38: // UpArrow
                    case 87: // W
                        dir = [0, -1];
                        break;
                    case 39: // RightArrow
                    case 68: // D
                        dir = [1, 0];
                        break;
                    case 40: // DownArrow
                    case 83: // S
                        dir = [0, 1];
                        break;
                }
                if (dir !== null) {
                    if (this.player.move(this.maze, dir[0], dir[1])) {
                        this.moveCooldown = PLAYER_SPEED;

                        let key = this.keyStack.splice(i, 1)[0];
                        this.keyStack.splice(0, 0, key);

                        break;
                    }
                }
            }
        }
        if (this.moveCooldown > 0) {
            this.moveCooldown -= 1;
        }

        for (let i = this.ammunitions.length - 1; i >= 0; i--) {
            let [x, y] = this.ammunitions[i];
            if (this.player.posX === x && this.player.posY === y) {
                this.player.ammunition += 1;
                this.ammunitions.splice(i, 1);
            }
        }

        for (let monster of this.monsters) {
            if (this.player.posX === monster.posX && this.player.posY === monster.posY && !monster.isDead) {
                this.player.isDead = true;
            }
        }

        this.graphics.moveCamera();

        // Drawing
        this.graphics.startDrawing();
        this.graphics.drawMaze(this.maze);

        this.graphics.drawMonsters(this.monsters);
        this.graphics.drawPlayer(this.player);

        for (let [x, y] of this.ammunitions) {
            this.graphics.drawAmmunition(x, y);
        }

        this.graphics.drawFogOfWar(this.maze, this.player);

        this.graphics.endDrawing();

        this.graphics.drawUI(this.player, this.monsters, this.attempt);
    }

    keyPressed(keyCode) {
        switch (keyCode) {
            case 13:
                if (this.monsters.every((monster) => monster.isDead))
                    resetLevel(true);
                break;
            case 32:
                this.player.fireGun(this.monsters, this.maze);
                break;
            case 37:
            case 38:
            case 39:
            case 40:
            case 65:
            case 68:
            case 83:
            case 87:
                if (this.keyStack.indexOf(keyCode) < 0) {
                    this.keyStack.push(keyCode);
                }
                break;
            case 82:
                this.resetLevel();
                break;
        }
    }

    keyReleased(keyCode) {
        switch (window.keyCode) {
            case 37:
            case 38:
            case 39:
            case 40:
            case 65:
            case 68:
            case 83:
            case 87:
                let idx = this.keyStack.indexOf(keyCode);
                if (idx >= 0) {
                    this.keyStack.splice(idx, 1);
                }
                break;
        }
    }
}

let gameState = null;
let levelIdx = 0;

window.preload = () => {
    window.angleMode(window.DEGREES);
    loadGraphics();
}

window.setup = () => {
    window.createCanvas(window.innerWidth, window.innerHeight);

};

window.windowResized = () => {
    window.resizeCanvas(window.innerWidth, window.innerHeight);
}

window.draw = () => {
    if (gameState !== null) {
        gameState.draw();
    } else {
        window.background(0, 0, 0);
        drawMainMenu();
    }
};

window.keyPressed = () => {
    console.log("Pressed: :", window.keyCode);
    switch (window.keyCode) {
        case 13:
            if (gameState !== null && gameState.monsters.every((monster) => monster.isDead))
                gameState = null;
            break;
        case 27:
            gameState = null;
            break;
        case 49:
            if (gameState === null)
                gameState = new GameState(levelIdx = 0);
            break;
        case 50:
            if (gameState === null)
                gameState = new GameState(levelIdx = 1);
            break;
        case 51:
            if (gameState === null)
                gameState = new GameState(levelIdx = 2);
            break;
        default:
            if (gameState !== null) {
                gameState.keyPressed(window.keyCode);
            }
            break;
    }
};
window.keyReleased = () => {
    console.log("Released: :", window.keyCode);
    if (gameState !== null) {
        gameState.keyReleased(window.keyCode);
    }
};
