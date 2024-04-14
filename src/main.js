import { MINOTAUR_SPEED, PLAYER_SPEED } from "./constants.js";
import { Graphics, loadGraphics } from "./graphics.js";
import { Maze } from "./maze.js";
import { Minotaur } from "./minotaur.js";
import { Player } from "./player.js";

let maze;
let graphics;
let player;
let ammunitions;
let startPos;
let minotaur;

let moveCooldown;
let keyStack = [];

window.preload = () => {
    window.angleMode(window.DEGREES);
    loadGraphics();
}

function resetGame(resetMaze) {
    if (resetMaze) maze = new Maze(8, 8, 4, 4);
    graphics = new Graphics("mansion");
    player = new Player(8, 19);
    startPos = [player.posX, player.posY];
    ammunitions = [[8, 17], [8, 16]];
    minotaur = null;
    moveCooldown = 0;
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

    if (frameCount % MINOTAUR_SPEED === 0 && minotaur !== null && !minotaur.isDead) {
        minotaur.stepTowardsPlayer(player, maze);
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

    if (minotaur !== null) {
        if (player.posX === minotaur.posX && player.posY === minotaur.posY && !minotaur.isDead) {
            player.isDead = true;
        }
    }

    graphics.moveCamera();

    // Drawing
    graphics.startDrawing();
    graphics.drawMaze(maze);

    if (minotaur !== null) {
        graphics.drawMinotaur(minotaur);
    }
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
            player.fireGun(minotaur, maze);
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

    let [startX, startY] = startPos;
    if (minotaur === null && Math.abs(startX - player.posX) + Math.abs(startY - player.posY) > 2) {
        minotaur = new Minotaur(startX, startY);
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
