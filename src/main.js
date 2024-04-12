import { Maze } from "./maze.js";

let maze = new Maze(20, 15);

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
        window.line(x1 * 20 + 100, y1 * 20 + 100, x2 * 20 + 100, y2 * 20 + 100);
    }

};

window.keyPressed = () => {
    console.log(window.keyCode);
};
window.keyReleased = () => {
    console.log(window.keyCode);
};
