import { Maze } from "./maze.js";
import { Player } from "./player.js";

let maze = new Maze(20, 15);

let player = new Player(0, 0);

const CELL_SIZE = 20;

window.setup = () => {
    window.createCanvas(window.innerWidth, window.innerHeight);

};

window.windowResized = () => {
    window.resizeCanvas(window.innerWidth, window.innerHeight);
}

window.draw = () => {
    window.background(100, 100, 100);

    
    window.stroke(255, 255, 255);
    window.strokeWeight(3);

    for (let [x1, y1, x2, y2] of maze.getWalls()) {
        window.line
            ( x1 * CELL_SIZE
            , y1 * CELL_SIZE
            , x2 * CELL_SIZE
            , y2 * CELL_SIZE
            );
    }

    // Draw player
    window.fill(255, 0, 0);
    window.noStroke(3);
    window.rect
        (player.posX * CELL_SIZE
        , player.posY * CELL_SIZE
        , CELL_SIZE
        , CELL_SIZE
        );
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
};
window.keyReleased = () => {
    console.log("Released: :", window.keyCode);
};
