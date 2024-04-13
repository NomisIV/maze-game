
const CELL_SIZE = 100;

let cameraX = null;
let cameraY = null;

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
    window.background(50, 50, 50);

    window.push();
    window.translate(window.width / 2, window.height / 2);
    window.scale(CELL_SIZE);
    window.translate(-(cameraX || 0), -(cameraY || 0));
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
    window.fill(255, 0, 0);
    window.noStroke();
    window.rect(player.posX + 0.2, player.posY + 0.2, 0.6, 0.6);
}

export function drawMinotaur(minotaur) {
    window.fill(200, 100, 40);
    window.noStroke();
    window.rect(minotaur.posX + 0.2, minotaur.posY + 0.2, 0.6, 0.6);
}
