import { PLAYER_SPEED } from "./constants.js";
import { Graphics, loadGraphics } from "./graphics.js";
import { cellMaze, layerMaze } from "./maze.js";
import { Monster } from "./monster.js";
import { Player } from "./player.js";

let maze;
let graphics;
let player;
let ammunitions = [];
let monsters = [];

let moveCooldown;
let keyStack = [];

window.preload = () => {
    window.angleMode(window.DEGREES);
    loadGraphics();
}

let levelExtra;
function loadLevel(levelIdx, resetMaze) {
    moveCooldown = 0;

    let oldGraphics = graphics;

    switch (levelIdx % 2) {
        case 0:
            if (resetMaze) {
                maze = layerMaze(17, 6, 4);
                levelExtra = [[Math.floor(Math.random() * 17), 0]];
            };
            graphics = new Graphics("sand");
            player = new Player(8, 23);

            ammunitions = levelExtra.slice();
            monsters = [new Monster(8, 30, "minotaur", 20)];
            break;
        case 1:
            if (resetMaze) {
                maze = cellMaze(4, 4, 6, 6);

                let pos1 = Math.floor(Math.random() * 24);
                let pos2 = Math.floor(Math.random() * 24);
                if ((pos1 ^ pos2) & 1) pos2 ^= 1;
                levelExtra = Math.random() < 0.5 ? [[pos1, 0], [pos2, 23]] : [[0, pos1], [23, pos2]];
            }
            graphics = new Graphics("mansion");
            player = new Player(8, 19);

            ammunitions = levelExtra.slice();
            monsters = levelExtra.map(([x, y]) => new Monster(x, y, "bat", 32));
            break;
    }

    if (!resetMaze) {
        graphics.copyExplored(oldGraphics);
    }
}

let currentLevel = -1;
function resetGame(resetMaze) {
    if (resetMaze) currentLevel += 1;
    loadLevel(currentLevel, resetMaze);
}

window.setup = () => {
    resetGame(true);

    window.createCanvas(window.innerWidth, window.innerHeight);

};

window.windowResized = () => {
    window.resizeCanvas(window.innerWidth, window.innerHeight);
}

window.draw = () => {
    // Game logic
    for (let monster of monsters) {
        if (frameCount % monster.speed === 0) {
            if (!monster.isDead) {
                monster.stepTowardsPlayer(player, maze);
            }
        }
    }

    if (moveCooldown === 0 && keyStack.length > 0 && !player.isDead) {
        for (let i = keyStack.length - 1; i >= 0; i--) {
            let dir = null;

            switch (keyStack[i]) {
                case 37: // LeftArrow
                    dir = [-1, 0];
                    break;
                case 38: // UpArrow
                    dir = [0, -1];
                    break;
                case 39: // RightArrow
                    dir = [1, 0];
                    break;
                case 40: // DownArrow
                    dir = [0, 1];
                    break;
            }
            if (dir !== null) {
                if (player.move(maze, dir[0], dir[1])) {
                    moveCooldown = PLAYER_SPEED;

                    let key = keyStack.splice(i, 1)[0];
                    keyStack.splice(0, 0, key);

                    break;
                }
            }
        }
    }
    if (moveCooldown > 0) {
        moveCooldown -= 1;
    }

    for (let i = ammunitions.length - 1; i >= 0; i--) {
        let [x, y] = ammunitions[i];
        if (player.posX === x && player.posY === y) {
            player.ammunition += 1;
            ammunitions.splice(i, 1);
        }
    }

    for (let monster of monsters) {
        if (player.posX === monster.posX && player.posY === monster.posY && !monster.isDead) {
            player.isDead = true;
        }
    }

    graphics.moveCamera();

    // Drawing
    graphics.startDrawing();
    graphics.drawMaze(maze);

    graphics.drawMonsters(monsters);
    graphics.drawPlayer(player);

    for (let [x, y] of ammunitions) {
        graphics.drawAmmunition(x, y);
    }

    graphics.drawFogOfWar(maze, player);

    graphics.endDrawing();
};

window.keyPressed = () => {
    console.log("Pressed: :", window.keyCode);
    switch (window.keyCode) {
        case 27:
            resetGame(true);
            break;
        case 32:
            player.fireGun(monsters, maze);
            break;
        case 37:
        case 38:
        case 39:
        case 40:
            if (keyStack.indexOf(window.keyCode) < 0) {
                keyStack.push(window.keyCode);
            }
            break;
        case 82:
            resetGame(false);
            break;
    }
};
window.keyReleased = () => {
    console.log("Released: :", window.keyCode);
    switch (window.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
            let idx = keyStack.indexOf(window.keyCode);
            if (idx >= 0) {
                keyStack.splice(idx, 1);
            }
            break;
    }
};
