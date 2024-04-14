export function cellMaze(chunkWidth, chunkHeight, numX, numY) {
    let maze = new Maze(chunkWidth * numX, chunkHeight * numY);

    maze._splitHorizontal(0, maze.width, -1, 0);
    maze._splitHorizontal(0, maze.width, -1, maze.height);
    maze._splitVertical(0, maze.height, -1, 0);
    maze._splitVertical(0, maze.height, -1, maze.width);

    for (let y = 0; y < maze.height; y += chunkHeight) {
        for (let x = 0; x < maze.width; x += chunkWidth) {
            if (x > 0) {
                let gapY = linearDistr(y, y + chunkHeight - 1);
                maze._splitVertical(y, y + chunkHeight, gapY, x);
            }
            if (y > 0) {
                let gapX = linearDistr(x, x + chunkWidth - 1);
                maze._splitHorizontal(x, x + chunkWidth, gapX, y);
            }

            maze._constructInner(x, y, x + chunkWidth, y + chunkHeight);
        }
    }
    
    return maze;
}

export function layerMaze(width, layerHeight, numLayers) {
    let maze = new Maze(width, layerHeight * numLayers);

    maze._splitHorizontal(0, maze.width, -1, 0);
    maze._splitHorizontal(0, maze.width, Math.floor(maze.width / 2), maze.height);
    maze._splitVertical(0, maze.height, -1, 0);
    maze._splitVertical(0, maze.height, -1, maze.width);

    let midX = Math.floor(maze.width / 2);
    maze._splitVertical(maze.height, maze.height + 20, -1, midX);
    maze._splitVertical(maze.height, maze.height + 20, -1, midX + 1);

    let oddOffset = Math.random() < 0.5 ? 1 : 0;
    for (let y = 0; y < maze.height; y += layerHeight) {
        if (y > 0) {
            let gapMin = oddOffset % 2 ? 0 : Math.floor(width / 2);
            let gapMax = oddOffset % 2 ? Math.floor(width / 2) : width - 1;
            let gapX = linearDistr(gapMin, gapMax);
            maze._splitHorizontal(0, maze.width, gapX, y);
            oddOffset += 1;
        }
        maze._constructInner(0, y, maze.width, y + layerHeight);
    }

    return maze;
}

class Maze {
    constructor(width, height) {
        this._walls = new Set();
        this.width = width;
        this.height = height;
    }

    _wallString(x1, y1, x2, y2) {
        return [`${x1} ${y1}`, `${x2} ${y2}`].sort().join(" ");
    }

    addWall(x1, y1, x2, y2) {
        this._walls.add(this._wallString(x1, y1, x2, y2));
    }

    hasWall(x1, y1, x2, y2) {
        return this._walls.has(this._wallString(x1, y1, x2, y2));
    }

    getWalls() {
        let walls = [];
        for (let wall of this._walls) {
            walls.push(wall.split(" ").map(n => parseInt(n)));
        }
        return walls;
    }

    _splitHorizontal(minX, maxX, gapX, y) {
        for (let x = minX; x < maxX; x++) {
            if (x != gapX) this.addWall(x, y, x + 1, y);
        }
    }

    _splitVertical(minY, maxY, gapY, x) {
        for (let y = minY; y < maxY; y++) {
            if (y != gapY) this.addWall(x, y, x, y + 1);
        }
    }

    _constructInner(minX, minY, maxX, maxY) {
        let width = maxX - minX;
        let height = maxY - minY;
        if (width <= 1 || height <= 1) return;

        let vertical =
            width > height * 2.5 ? true :
            width * 2.5 < height ? false :
            Math.random() < 0.5;

        if (vertical) {
            // Split with a vertical wall
            let splitX = triangleDistr(minX + 1, maxX - 1);
            let gapY = linearDistr(minY, maxY - 1);
            this._splitVertical(minY, maxY, gapY, splitX);

            this._constructInner(minX, minY, splitX, maxY);
            this._constructInner(splitX, minY, maxX, maxY);
        } else {
            // Split with a horizontal wall
            let splitY = triangleDistr(minY + 1, maxY - 1);
            let gapX = linearDistr(minX, maxX - 1);
            this._splitHorizontal(minX, maxX, gapX, splitY);

            this._constructInner(minX, minY, maxX, splitY);
            this._constructInner(minX, splitY, maxX, maxY);
        }
    }
}

function linearDistr(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function triangleDistr(min, max) {
    let r = (Math.random() + Math.random()) / 2;
    return min + Math.floor(r * (max - min + 1));
}
