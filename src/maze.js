export class Maze {
    constructor(width, height) {
        this._walls = new Set();
        this.height = height;
        this.width = width;
        this._construct(0, 0, width, height, true);
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

    _construct(minX, minY, maxX, maxY, outerWalls = false) {
        if (outerWalls) {
            for (let x = minX; x < maxX; x++) {
                this.addWall(x, minY, x + 1, minY);
                this.addWall(x, maxY, x + 1, maxY);
            }
            for (let y = minY; y < maxY; y++) {
                this.addWall(minX, y, minX, y + 1);
                this.addWall(maxX, y, maxX, y + 1);
            }
        }

        let width = maxX - minX;
        let height = maxY - minY;
        if (width <= 1 || height <= 1) return;

        if (Math.random() * (width + height) < width) {
            // Split with a vertical wall

            let splitX = minX + 1 + Math.floor(Math.random() * (width - 1));
            let gapY = minY + Math.floor(Math.random() * height);

            for (let y = minY; y < maxY; y++) {
                if (y != gapY) this.addWall(splitX, y, splitX, y + 1);
            }

            this._construct(minX, minY, splitX, maxY);
            this._construct(splitX, minY, maxX, maxY);
        } else {
            // Split with a horizontal wall

            let splitY = minY + 1 + Math.floor(Math.random() * (height - 1));
            let gapX = minX + Math.floor(Math.random() * width);

            for (let x = minX; x < maxX; x++) {
                if (x != gapX) this.addWall(x, splitY, x + 1, splitY);
            }

            this._construct(minX, minY, maxX, splitY);
            this._construct(minX, splitY, maxX, maxY);
        }
    }
}
