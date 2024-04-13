import { CELL_SIZE, CELL_SIZE_SCREEN, FOG_FADE_OUT, MINOTAUR_SPEED, PLAYER_SPEED } from "./constants.js";


let cameraX = null;
let cameraY = null;

let playerX = null;
let playerY = null;

let minotaurX = null;
let minotaurY = null;

let cornerWallTile, noWallTile, straightWallTile;

let shownTiles = new Map();
function shownTime(x, y) {
    if (!shownTiles.has([x, y].join(" "))) return 0;
    return (Date.now() - shownTiles.get([x, y].join(" "))) / 1000;
}
function addShown(x, y) {
    if (!shownTiles.has([x, y].join(" "))) {
        shownTiles.set([x, y].join(" "), Date.now());
    }
}

export function loadGraphics() {
    cornerWallTile = window.loadImage("assets/corner-wall-tile.png");
    noWallTile = window.loadImage("assets/no-wall-tile.png");
    straightWallTile = window.loadImage("assets/straight-wall-tile.png");
}

export function moveCamera() {
    if (playerX === null || playerY === null) return;

    if (cameraX === null || cameraY === null) {
        cameraX = playerX + 0.5;
        cameraY = playerY + 0.5;
    }

    let lerp = Math.exp(-window.deltaTime / 1000 * 3.0);
    cameraX = lerp * cameraX + (1 - lerp) * (playerX + 0.5);
    cameraY = lerp * cameraY + (1 - lerp) * (playerY + 0.5);
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
    window.rect(roundToPixel(playerX + 0.25), roundToPixel(playerY + 0.25), 0.5, 0.5);
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
    window.rect(roundToPixel(minotaurX + 0.25), roundToPixel(minotaurY + 0.25), 0.5, 0.5);
}

export function drawFogOfWar(maze, player) {

    addShown(player.posX, player.posY);

    for (let x = player.posX; x < player.posX + 3; x++) {
        let y = player.posY;
        addShown(x, y);
        if (maze.hasWall(x + 1, y, x + 1, y + 1)) break;
    }
    for (let x = player.posX; x > player.posX - 3; x--) {
        let y = player.posY;
        addShown(x, y);
        if (maze.hasWall(x, y, x, y + 1)) break;
    }
    for (let y = player.posY; y < player.posY + 3; y++) {
        let x = player.posX;
        addShown(x, y);
        if (maze.hasWall(x, y + 1, x + 1, y + 1)) break;
    }
    for (let y = player.posY; y > player.posY - 3; y--) {
        let x = player.posX;
        addShown(x, y);
        if (maze.hasWall(x, y, x + 1, y)) break;
    }

    let minX = Math.floor((cameraX || 0) - window.width / 2 / CELL_SIZE_SCREEN);
    let maxX = Math.ceil((cameraX || 0) + window.width / 2 / CELL_SIZE_SCREEN);
    let minY = Math.floor((cameraY || 0) - window.height / 2 / CELL_SIZE_SCREEN);
    let maxY = Math.ceil((cameraY || 0) + window.height / 2 / CELL_SIZE_SCREEN);

    for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
            let time = shownTime(x, y);
            if (time < FOG_FADE_OUT) {
                window.fill(0, 0, 0, (1 - time / FOG_FADE_OUT) * 255);
                window.rect(x, y, 1, 1);
            }
        }
    }


    // window.fill(0, 0, 0);
    // window.rect(player.posX - 10, player.posY - 10, 9, 10);
    // window.rect(player.posX - 1, player.posY - 10, 1, 9);
    // window.rect(player.posX + 1, player.posY - 10, 1, 9);
    // window.rect(player.posX + 2, player.posY - 10, 9, 10);
    // window.rect(player.posX - 10, player.posY + 1, 9, 10);
    // window.rect(player.posX - 1, player.posY + 2, 1, 9);
    // window.rect(player.posX + 1, player.posY + 2, 1, 9);
    // window.rect(player.posX + 2, player.posY + 1, 9, 10);

    // for (let x = player.posX; x < player.posX + 10; x++) {
    //     if (maze.hasWall(x + 1, player.posY, x + 1, player.posY + 1)) {
    //         x = Math.max(x + 1, player.posX + 2);
    //         window.rect(x, player.posY, 10, 1);
    //         break;
    //     }
    // }
    // for (let y = player.posY; y < player.posY + 10; y++) {
    //     if (maze.hasWall(player.posX, y, player.posX + 1, y)) {
    //         y = Math.max(y + 1, player.posY + 2);
    //         window.rect(player.posX, y, 1, 10);
    //         break;
    //     }
    // }
}
