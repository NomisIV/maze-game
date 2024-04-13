import { CELL_SIZE, MINOTAUR_SPEED, PLAYER_SPEED } from "./constants.js";


let cameraX = null;
let cameraY = null;

let playerX = null;
let playerY = null;

let minotaurX = null;
let minotaurY = null;

export function moveCamera(x, y) {
    if (cameraX === null || cameraY === null) {
        cameraX = x;
        cameraY = y;
    }

    let lerp = Math.exp(-window.deltaTime / 1000 * 3.0);
    cameraX = lerp * cameraX + (1 - lerp) * x;
    cameraY = lerp * cameraY + (1 - lerp) * y;
}

export function startDrawing() {
    window.push();
    window.noSmooth();
    window.translate(window.width / 2, window.height / 2);
    window.scale(CELL_SIZE);
    window.translate(-(cameraX || 0), -(cameraY || 0));

    window.background(50, 50, 50);
}

export function endDrawing() {
    window.pop();
}

export function drawMaze(maze) {
    window.stroke(150, 150, 150);
    window.strokeWeight(0.1);

    for (let [x1, y1, x2, y2] of maze.getWalls()) {
        window.line(x1, y1, x2, y2);
    }
}

export function drawPlayer(player) {
    if (playerX === null || playerY === null) {
        playerX = player.posX;
        playerY = player.posY;
    }

    let maxDelta = 1 / (PLAYER_SPEED / 2);
    let limit = v => Math.min(Math.max(-maxDelta, v), maxDelta);
    playerX += limit(player.posX - playerX);
    playerY += limit(player.posY - playerY);

    window.fill(255, 0, 0);
    window.noStroke();
    window.rect(playerX + 0.2, playerY + 0.2, 0.6, 0.6);
}

export function drawMinotaur(minotaur) {
    if (minotaurX === null || minotaurY === null) {
        minotaurX = minotaur.posX;
        minotaurY = minotaur.posY;
    }

    let maxDelta = 1 / MINOTAUR_SPEED;
    let limit = v => Math.min(Math.max(-maxDelta, v), maxDelta);
    minotaurX += limit(minotaur.posX - minotaurX);
    minotaurY += limit(minotaur.posY - minotaurY);

    window.fill(200, 100, 40);
    window.noStroke();
    window.rect(minotaurX + 0.2, minotaurY + 0.2, 0.6, 0.6);
}
