import { CELL_SIZE, FOG_FADE_IN, FOG_FADE_OUT, MOVE_SPEED } from "./constants.js";

let playerSprite, ammoSprite;
let tilesets = {};
let monsterSprites = {};
let pixelFont;

export function loadGraphics() {
    playerSprite = window.loadImage("assets/player.png");
    ammoSprite = window.loadImage("assets/shotgun-shell.png");
    tilesets["mansion"] = window.loadImage("assets/mansion-tiles.png");
    tilesets["sand"] = window.loadImage("assets/sand-tiles.png");
    tilesets["hell"] = window.loadImage("assets/hell-tiles.png");
    monsterSprites["minotaur"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/Rancorous Bull/RancorousBull.png");
    monsterSprites["bat"] = window.loadImage("assets/demon-asset-pack/basic/basic asset pack/Basic Demon Animations/nefarious scamp/NefariousScamp.png");
    monsterSprites["dog"] = window.loadImage("assets/demon-asset-pack/premium/premium asset pack/Premium Demon Animations/rabid cerberus/RabidCerberus.png");
    pixelFont = window.loadFont("assets/pixel-emulator-font/PixelEmulator-xq08.ttf")
}

function cellSizeScreen() {
    let size = Math.min(window.width, window.height);
    let scale = size / (CELL_SIZE * 6);

    return CELL_SIZE * Math.max(1, Math.floor(scale));
}

function roundToPixel(coord) {
    return Math.round(coord * CELL_SIZE) / CELL_SIZE;
}

function roundToScreenPixel(coord) {
    return Math.round(coord * cellSizeScreen()) / cellSizeScreen();
}

export class Graphics {
    constructor(tilesetName) {
        this.cameraX = null;
        this.cameraY = null;
        this.playerX = null;
        this.playerY = null;
        this.monsterPos = [];
        this.shownTiles = new Map();
        this.tileset = tilesets[tilesetName];

        this.grayTileset = window.createImage(48, 32);
        this.grayTileset.copy(this.tileset, 0, 0, 48, 32, 0, 0, 48, 32);
        this.grayTileset.filter(window.GRAY);
    }

    shownTime(x, y) {
        if (!this.shownTiles.has([x, y].join(" "))) return 0;
        return (Date.now() - this.shownTiles.get([x, y].join(" "))) / 1000;
    }

    addShown(x, y) {
        if (this.shownTiles.has([x, y].join(" "))) {
            let oldTime = this.shownTiles.get([x, y].join(" "));
            if (oldTime + FOG_FADE_OUT * 1000 < Date.now()) {
                this.shownTiles.set([x, y].join(" "), Date.now() - FOG_FADE_OUT * 1000);
            }
        } else {
            this.shownTiles.set([x, y].join(" "), Date.now());
        }
    }

    copyExplored(other) {
        for (let [pos, _] of other.shownTiles) {
            this.shownTiles.set(pos, Date.now() - FOG_FADE_IN * 1000);
        }
    }

    moveCamera() {
        if (this.playerX === null || this.playerY === null) return;

        if (this.cameraX === null || this.cameraY === null) {
            this.cameraX = this.playerX + 0.5;
            this.cameraY = this.playerY + 0.5;
        }

        let lerp = Math.exp(-window.deltaTime / 1000 * 3.0);
        this.cameraX = lerp * this.cameraX + (1 - lerp) * (this.playerX + 0.5);
        this.cameraY = lerp * this.cameraY + (1 - lerp) * (this.playerY + 0.5);
    }


    startDrawing() {
        window.push();
        window.noSmooth();
        window.translate(Math.floor(window.width / 2), Math.floor(window.height / 2));
        window.scale(cellSizeScreen());
        window.translate(-roundToScreenPixel(this.cameraX || 0), -roundToScreenPixel(this.cameraY || 0));
        //window.scale(32);

        window.background(50, 50, 50);
    }

    endDrawing() {
        window.pop();
    }

    drawMaze(maze) {
        let minX = Math.floor((this.cameraX || 0) - window.width / 2 / cellSizeScreen());
        let maxX = Math.ceil((this.cameraX || 0) + window.width / 2 / cellSizeScreen());
        let minY = Math.floor((this.cameraY || 0) - window.height / 2 / cellSizeScreen());
        let maxY = Math.ceil((this.cameraY || 0) + window.height / 2 / cellSizeScreen());

        
        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                let time = this.shownTime(x, y);
                if (time <= 0) continue;
                let tileset = time < FOG_FADE_IN ? this.tileset : this.grayTileset;

                window.push();
                window.translate(x, y);

                let wallU = maze.hasWall(x, y, x + 1, y);
                let wallL = maze.hasWall(x, y, x, y + 1);
                let wallD = maze.hasWall(x, y + 1, x + 1, y + 1);
                let wallR = maze.hasWall(x + 1, y, x + 1, y + 1);
                window.image(tileset, 0.25, 0.25, 0.5, 0.5, 0, 0, 16, 16);

                window.image(tileset, 0, 0.25, 0.25, 0.5, wallL ? 24 : 8, 0, 8, 16);
                window.image(tileset, 0.75, 0.25, 0.25, 0.5, wallR ? 16 : 0, 0, 8, 16);
                window.image(tileset, 0.25, 0, 0.5, 0.25, wallU ? 32 : 0, 8, 16, 8);
                window.image(tileset, 0.25, 0.75, 0.5, 0.25, wallD ? 32 : 0, 0, 16, 8);

                if (wallU && wallL) window.image(tileset, 0, 0, 0.25, 0.25, 24, 24, 8, 8);
                else if (wallU) window.image(tileset, 0, 0, 0.25, 0.25, 40, 8, 8, 8);
                else if (wallL) window.image(tileset, 0, 0, 0.25, 0.25, 24, 8, 8, 8);
                else window.image(tileset, 0, 0, 0.25, 0.25, 8, 24, 8, 8);

                if (wallU && wallR) window.image(tileset, 0.75, 0, 0.25, 0.25, 16, 24, 8, 8);
                else if (wallU) window.image(tileset, 0.75, 0, 0.25, 0.25, 32, 8, 8, 8);
                else if (wallR) window.image(tileset, 0.75, 0, 0.25, 0.25, 16, 8, 8, 8);
                else window.image(tileset, 0.75, 0, 0.25, 0.25, 0, 24, 8, 8);

                if (wallD && wallL) window.image(tileset, 0, 0.75, 0.25, 0.25, 24, 16, 8, 8);
                else if (wallD) window.image(tileset, 0, 0.75, 0.25, 0.25, 40, 0, 8, 8);
                else if (wallL) window.image(tileset, 0, 0.75, 0.25, 0.25, 24, 0, 8, 8);
                else window.image(tileset, 0, 0.75, 0.25, 0.25, 8, 16, 8, 8);

                if (wallD && wallR) window.image(tileset, 0.75, 0.75, 0.25, 0.25, 16, 16, 8, 8);
                else if (wallD) window.image(tileset, 0.75, 0.75, 0.25, 0.25, 32, 0, 8, 8);
                else if (wallR) window.image(tileset, 0.75, 0.75, 0.25, 0.25, 16, 0, 8, 8);
                else window.image(tileset, 0.75, 0.75, 0.25, 0.25, 0, 16, 8, 8);

                window.pop();

            }
        }

    }

    drawPlayer(player) {
        if (this.playerX === null || this.playerY === null) {
            this.playerX = player.posX;
            this.playerY = player.posY;
        }

        let maxDelta = 1 / MOVE_SPEED;
        let limit = v => Math.min(Math.max(-maxDelta, v), maxDelta);
        this.playerX += limit(player.posX - this.playerX);
        this.playerY += limit(player.posY - this.playerY);

        if (player.isDead) {
            window.push();
            window.translate(roundToPixel(this.playerX + 0.5), roundToPixel(this.playerY + 0.5));
            window.rotate(-90);
            if (player.dir === "left") {
                window.scale(1, -1);
            }
            window.image(playerSprite, -0.25, -0.25, 0.5, 0.5, 0, 0, 16, 16);
            window.pop();
            return;
        }

        let dir = ["right", "left", "up", "down"].indexOf(player.direction);
        window.image(playerSprite, this.playerX + 0.25, this.playerY + 0.25, 0.5, 0.5, dir * 16, 0, 16, 16);
    }

    drawMonsters(monsters) {
        for (let i = 0; i < monsters.length; i++) {
            let monster = monsters[i];
            if (i >= this.monsterPos.length) {
                this.monsterPos.push([monster.posX, monster.posY]);
            }
            let [monsterX, monsterY] = this.monsterPos[i];

            let maxDelta = 1 / MOVE_SPEED;
            let limit = v => Math.min(Math.max(-maxDelta, v), maxDelta);
            monsterX += limit(monster.posX - monsterX);
            monsterY += limit(monster.posY - monsterY);
            this.monsterPos[i] = [monsterX, monsterY];

            if (this.shownTime(monster.posX, monster.posY) > FOG_FADE_IN) {
                continue;
            }

            if (!(monster.type in monsterSprites)) continue;
            let monsterSprite = monsterSprites[monster.type];

            if (monster.isDead) {
                window.push();
                window.translate(roundToPixel(monsterX + 0.5), roundToPixel(monsterY + 0.5));
                window.rotate(-90);
                if (monster.isLookingLeft) {
                    window.scale(1, -1);
                }
                window.image(monsterSprite, -0.25, -0.25, 0.5, 0.5, 0, 0, 16, 16);
                window.pop();
                continue;
            }

            let sx = Math.floor(window.frameCount / 60 * 10) % 4 * 16;
            if (sx === 48 && monster.type === "minotaur") sx = 16;
            window.push();
            window.translate(roundToPixel(monsterX + 0.5), roundToPixel(monsterY + 0.5))
            if (monster.isLookingLeft) {
                window.scale(-1, 1);
            }
            window.image(monsterSprite, -0.25, -0.25, 0.5, 0.5, sx, 0, 16, 16);
            window.pop();
        }
    }

    drawAmmunition(x, y) {
        let float = Math.floor(window.frameCount / 60 * 2) % 2 / 16;
        window.image(ammoSprite, x + 0.25, y + 0.25 + float, 0.5, 0.5)
    }

    exploreAt(x, y, maze, dist = 2, seen = new Set()) {
        if (seen.has([x, y].join(" "))) return;
        seen.add([x, y].join(" "));

        this.addShown(x, y);
        if (dist < 1) return;

        if (!maze.hasWall(x + 1, y, x + 1, y + 1))
            this.exploreAt(x + 1, y, maze, dist - 1, seen);
        if (!maze.hasWall(x, y + 1, x + 1, y + 1))
            this.exploreAt(x, y + 1, maze, dist - 1, seen);
        if (!maze.hasWall(x, y, x, y + 1))
            this.exploreAt(x - 1, y, maze, dist - 1, seen);
        if (!maze.hasWall(x, y, x + 1, y))
            this.exploreAt(x, y - 1, maze, dist - 1, seen);
    }

    drawFogOfWar(maze, player) {
        // return;

        window.noStroke();

        this.exploreAt(player.posX, player.posY, maze);

        let minX = Math.floor((this.cameraX || 0) - window.width / 2 / cellSizeScreen());
        let maxX = Math.ceil((this.cameraX || 0) + window.width / 2 / cellSizeScreen());
        let minY = Math.floor((this.cameraY || 0) - window.height / 2 / cellSizeScreen());
        let maxY = Math.ceil((this.cameraY || 0) + window.height / 2 / cellSizeScreen());

        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                let time = this.shownTime(x, y);
                if (time < FOG_FADE_OUT) {
                    let alpha = 1 - time / FOG_FADE_OUT;
                    window.fill(0, 0, 0, alpha * 255);
                    window.rect(x, y, 1, 1);
                } else {
                    let alpha = Math.min((time - FOG_FADE_OUT) / FOG_FADE_IN, 1);
                    window.fill(0, 0, 0, alpha * 128);
                    window.rect(x, y, 1, 1);
                }
            }
        }
    }

    drawUI(player, monsters) {
        window.noSmooth();
        if (player.hasAmmonution) {
            window.image(ammoSprite, window.width - 128, window.height - 128, 128, 128);
        }
        if (player.isDead) {
            window.textFont(pixelFont);
            window.textSize(100);
            window.fill('yellow');
            window.textAlign(CENTER);
            window.text('You died', window.width / 2, window.height / 2);
            window.textSize(50);
            window.text('Press R to retry', window.width / 2, window.height / 2 + 100);
        }
        if (monsters.every((monster) => monster.isDead)) {
            window.textFont(pixelFont);
            window.textSize(100);
            window.fill('yellow');
            window.textAlign(CENTER);
            window.text('You survived', window.width / 2, window.height / 2);
            window.textSize(50);
            window.text('Press Enter to return to the menu', window.width / 2, window.height / 2 + 100);
        }
    }
}

export function drawMainMenu() {
    window.textFont(pixelFont);
    window.textSize(100);
    window.fill('yellow');
    window.textAlign(CENTER);
    window.text('Minotaur Hunter', window.width / 2, window.height / 2 - 100);
    window.textSize(50);
    window.text('Press 1 for "Minotaur Maze"', window.width / 2, window.height / 2);
    window.text('Press 2 for "Luigi\'s Mansion"', window.width / 2, window.height / 2 + 100);
    window.text('Press 3 for "Literal Hell"', window.width / 2, window.height / 2 + 200);
}
