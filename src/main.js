import { drawMaze, drawMinotaur, drawPlayer, endDrawing, moveCamera, startDrawing } from "./graphics.js";
import { Maze } from "./maze.js";
import { Minotaur } from "./minotaur.js";
import { Player } from "./player.js";

let maze = new Maze(17, 20);

let player = new Player(8, 19);
let startPos = [player.posX, player.posY];
let minotaur = null;

window.setup = () => {
    window.createCanvas(window.innerWidth, window.innerHeight);

};

window.windowResized = () => {
    window.resizeCanvas(window.innerWidth, window.innerHeight);
}

window.draw = () => {
    // Game logic

    if (frameCount % 15 === 0 && minotaur !== null) {
        minotaur.stepTowardsPlayer(player, maze);
    }


    moveCamera(player.posX + 0.5, player.posY + 0.5);

    // Drawing
    startDrawing();

    drawMaze(maze);

    drawPlayer(player);

    if (minotaur !== null) {
        drawMinotaur(minotaur);
    }

    endDrawing();
};

window.keyPressed = () => {
    console.log("Pressed: :", window.keyCode);
    switch (window.keyCode) {
        case 37: // LeftArrow
            player.move(maze, -1, 0)
            break;
        case 38: // UpArrow
            player.move(maze, 0, -1)
            break;
        case 39: // RightArrow
            player.move(maze, 1, 0)
            break;
        case 40: // DownArrow
            player.move(maze, 0, 1)
            break;
    }

    let [startX, startY] = startPos;
    if (minotaur === null && Math.abs(startX - player.posX) + Math.abs(startY - player.posY) > 2) {
        minotaur = new Minotaur(startX, startY);
    }
};
window.keyReleased = () => {
    console.log("Released: :", window.keyCode);
};
