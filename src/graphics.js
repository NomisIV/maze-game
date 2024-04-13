import { CELL_SIZE, CELL_SIZE_SCREEN, MINOTAUR_SPEED, PLAYER_SPEED } from "./constants.js";


let cameraX = null;
let cameraY = null;

let playerX = null;
let playerY = null;

let minotaurX = null;
let minotaurY = null;

let cornerWallTile, noWallTile, straightWallTile;

export function loadGraphics() {
    cornerWallTile = window.loadImage("assets/corner-wall-tile.png");
    noWallTile = window.loadImage("assets/no-wall-tile.png");
    straightWallTile = window.loadImage("assets/straight-wall-tile.png");
}

export function moveCamera(x, y) {
    if (cameraX === null || cameraY === null) {
        cameraX = x;
        cameraY = y;
    }

    let lerp = Math.exp(-window.deltaTime / 1000 * 3.0);
    cameraX = lerp * cameraX + (1 - lerp) * x;
    cameraY = lerp * cameraY + (1 - lerp) * y;
}

function roundToPixel(coord) {
    return Math.round(coord * CELL_SIZE) / CELL_SIZE;
}

function roundToScreenPixel(coord) {
    return Math.round(coord * CELL_SIZE_SCREEN) / CELL_SIZE_SCREEN;
}

export function startDrawing() {
    window.push();
    window.noSmooth();
    window.translate(Math.floor(window.width / 2), Math.floor(window.height / 2));
    window.scale(CELL_SIZE_SCREEN);
    window.translate(-roundToScreenPixel(cameraX || 0), -roundToScreenPixel(cameraY || 0));
    //window.scale(32);

    window.background(50, 50, 50);
}

export function endDrawing() {
    window.pop();
}

export function drawMaze(maze) {

    window.stroke(150, 150, 150);
    window.strokeWeight(0.1);

    let minX = Math.floor((cameraX || 0) - window.width / 2 / CELL_SIZE_SCREEN);
    let maxX = Math.ceil((cameraX || 0) + window.width / 2 / CELL_SIZE_SCREEN);
    let minY = Math.floor((cameraY || 0) - window.height / 2 / CELL_SIZE_SCREEN);
    let maxY = Math.ceil((cameraY || 0) + window.height / 2 / CELL_SIZE_SCREEN);

    for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
            window.push();
            window.translate(x + 0.5, y + 0.5);

            let wallU = maze.hasWall(x, y, x + 1, y);
            let wallL = maze.hasWall(x, y, x, y + 1);
            let wallD = maze.hasWall(x, y + 1, x + 1, y + 1);
            let wallR = maze.hasWall(x + 1, y, x + 1, y + 1);
            window.image(noWallTile, -0.25, -0.25, 0.25, 0.25);
            window.image(noWallTile,     0, -0.25, 0.25, 0.25);
            window.image(noWallTile, -0.25,     0, 0.25, 0.25);
            window.image(noWallTile,     0,     0, 0.25, 0.25);

            for (let wall of [wallR, wallD, wallL, wallU]) {
                window.image(cornerWallTile, 0.25, 0.25, 0.25, 0.25);
                if (wall) {
                    window.image(straightWallTile, 0.25, -0.25, 0.25, 0.25);
                    window.image(straightWallTile, 0.25,     0, 0.25, 0.25);
                } else {
                    window.image(noWallTile, 0.25, -0.25, 0.25, 0.25);
                    window.image(noWallTile, 0.25,     0, 0.25, 0.25);
                }
                window.rotate(90);
            }

            window.pop();

        }
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
