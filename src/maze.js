export class Maze {
    constructor(width, height) {
        this._walls = new Set();
        this.height = height;
        this.width = width;
        this._construct();
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

    _construct() {
        for (let x = 0; x < this.width; x++) {
            this.addWall(x, 0, x + 1, 0);
            this.addWall(x, this.height, x + 1, this.height);
        }
        for (let y = 0; y < this.height; y++) {
            this.addWall(0, y, 0, y + 1);
            this.addWall(this.width, y, this.width, y + 1);
        }

        let splits = evenSplits(1, this.height - 1, 3);

        let evenOffset = Math.floor(Math.random() * 2);

        for (let i = 0; i < splits.length; i++) {
            let minX = (i + evenOffset) % 2 ? Math.floor(this.width / 2) : 0;
            let maxX = (i + evenOffset) % 2 ? this.width : Math.ceil(this.width / 2);
            let gapX = linearDistr(minX, maxX - 1);
            this._splitHorizontal(0, this.width, gapX, splits[i]);
        }

        let lastY = 0;
        for (let i = 0; i < splits.length; i++) {
            this._constructInner(0, lastY, this.width, splits[i]);
            lastY = splits[i];
        }
        this._constructInner(0, lastY, this.width, this.height);

        this._constructInner(-10, -10, 0, this.height + 10);
        this._constructInner(this.width, -10, this.width + 10, this.height + 10);
        this._constructInner(0, -10, this.width, 0);
        this._constructInner(0, this.height, this.width, this.height + 10);
        this._splitVertical(this.height, this.height + 10, this.height + 1, 0);
        this._splitVertical(this.height, this.height + 10, this.height, this.width);
        this._splitVertical(-10, 0, -1, 0);
        this._splitVertical(-10, 0, -2, this.width);
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

    _constructInner(minX, minY, maxX, maxY, outerWalls = false) {
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

function evenSplits(min, max, splits) {
    if (splits === 0) return [];

    let splitsBefore = Math.floor((splits - 1) / 2);
    let splitsAfter = Math.ceil((splits - 1) / 2);

    let min2 = min + splitsBefore;
    let max2 = max - splitsAfter;

    let lo = Math.floor((min2 * 2 + max2 * 1) / 3);
    let hi = Math.ceil((min2 * 1 + max2 * 2) / 3);
    let split = triangleDistr(lo, hi);

    return [
        ...evenSplits(min, split - 1, splitsBefore),
        split,
        ...evenSplits(split + 1, max, splitsAfter),
    ];
}
