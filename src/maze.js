export class Maze {
    constructor(width, height) {

        this.walls = new Set();

        this.addWall(1, 2, 1, 3);
        this.addWall(1, 3, 2, 3);
        this.addWall(2, 3, 3, 3);
    }

    wallString(x1, y1, x2, y2) {
        return [`${x1} ${y1}`, `${x2} ${y2}`].sort().join(" ");
    }

    addWall(x1, y1, x2, y2) {
        this.walls.add(this.wallString(x1, y1, x2, y2));
    }

    hasWall(x1, y1, x2, y2) {
        return this.walls.has(this.wallString(x1, y1, x2, y2));
    }

    _construct() {

    }
}
