import { MINOTAUR_SPEED, PLAYER_SPEED } from "./constants.js";
import { Graphics, loadGraphics } from "./graphics.js";
import { Maze } from "./maze.js";
import { Minotaur } from "./minotaur.js";
import { Player } from "./player.js";

let maze = new Maze(17, 20);

let graphics = new Graphics();
let player = new Player(8, 19);
let startPos = [player.posX, player.posY];
let minotaur = null;

let keyStack = [];
let moveCooldown = 0;

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
    // Game logic

    if (frameCount % MINOTAUR_SPEED === 0 && minotaur !== null) {
        minotaur.stepTowardsPlayer(player, maze);
    }

    if (moveCooldown === 0 && keyStack.length > 0) {
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

    graphics.moveCamera();

    // Drawing
    graphics.startDrawing();
    graphics.drawMaze(maze);
    graphics.drawPlayer(player);

    if (minotaur !== null) {
        graphics.drawMinotaur(minotaur);
    }

    graphics.drawFogOfWar(maze, player);

    graphics.endDrawing();
};


window.keyPressed = () => {
    console.log("Pressed: :", window.keyCode);
    switch (window.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
            if (keyStack.indexOf(window.keyCode) < 0) {
                keyStack.push(window.keyCode);
            }
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
